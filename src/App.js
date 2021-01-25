import { useEffect, useState, useRef } from 'react';
import './App.css';
import IndoorTemp from './components/indoorTemp';
import ThermostatSwitch from './components/thermostatSwitch';
import BarChart from './components/barchart';
import Humidity from './components/humidity';

function App() {
  // Sensors
  const [ humiditySensor, setHumiditySensor ] = useState({});
  const [ temperatureSensor, setTemperatureSensor ] = useState({});
  const [ outdoorSensor, setOutdoorSensor ] = useState({});

  // State
  const [ thermostatState, setThermostatState ] = useState('');

  // Current Temperature
  const [ currentTemp, setCurrentTemp ] = useState(0);
  const [ desiredTemp, setDesiredTemp ] = useState(0);
  const [ autoON, setAutoON ] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await fetchSensors();
      await registerApp();
    };
    prepare();
  }, []);

  // Register Thermostat
  const registerApp = async () => {
    if (localStorage.getItem('uid') === null) {
      
      const registerUrl = 'https://api-staging.paritygo.com/sensors/api/thermostat/register/';
      try {
        const response = await fetch(registerUrl, {
            method: 'POST',
        });
        const data = await response.json();
        console.log('Registered:', data);

        // persist UID hash
        localStorage.setItem('uid', data.uid_hash);
      } catch (error) {
        console.error('Error:', error);
      };
    }
  }

  // Fetch Data
  const fetchSensors = async () => {
    const sensorUrl = 'http://api-staging.paritygo.com/sensors/api/sensors/';
    
    try {
      const response = await fetch(sensorUrl, {
        method: 'GET',
      });
      const data = await response.json();

      setHumiditySensor(data[0]);
      setTemperatureSensor(data[1]);
      setOutdoorSensor(data[2]);

      switchRef.current.fetchOutdoorTemp();

      //fetchTemperature
      if (data[1] !== {} && Object.keys(data[1]).length !== 0) {
        console.log(data[1], 'sensor');
        if (currentTemp == 0) {
          await fetchTemperature(data[1]);
          setDesiredTemp(currentTemp);
        }
      }

    } catch (error) {
      console.error('Error:', error);
    };
  }

  const fetchTemperature = async (sensorData) => {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMinutes(endDate.getMinutes() - 15);

    if (sensorData !== undefined) {
        const sensorSlug = sensorData.slug;

        const temperatureUrl = `http://api-staging.paritygo.com/sensors/api/sensors/${sensorSlug}/?begin=${startDate.toISOString()}&end=${endDate.toISOString()}`;

        try {
          const response = await fetch(temperatureUrl, {
              method: 'GET',
          });
          const data = await response.json();

          if (data.data_points && data.data_points.length >= 3) {
              const len = data.data_points.length;
              var sum = 0;

              for (var i=0; i<len; i++) {
                  sum += parseFloat(data.data_points[i].value);
              }
              
              const startTemp = Math.round((sum/ len)* 10) / 10;

              setCurrentTemp(startTemp);
          } else {
              console.error("There's a missing data point for the current temperature.");

              // use latest data point as replacement
              setCurrentTemp(Math.round(sensorData.latest_value* 10) / 10);
            }
          } catch (error) {
              console.error('Error:', error);
          };
    }
  }

  // Handle Callbacks
  const switchRef = useRef();
  const indoorTempCallback = (autoStatus, desiredTemp) => {

    setAutoON(autoStatus);
    setDesiredTemp(desiredTemp);

  }

  const switchCallback = (newState) => {
    setThermostatState(newState);
  }

  
  return (
    <div className="App">
      <div className="app-container">
        <div className="sidenav">
          
          <ul>
            <li><h3>Units</h3></li>
            <li>Unit #100</li>
            <li>Unit #200</li>
            <li>Unit #300</li>
          </ul>
        </div>
        <div className="row">
          <div className="main-container">
            <div className="container-center">
              <h2 className="main-heading">Unit #100</h2>
            </div>
            <div className="temp-container"> 
                <IndoorTemp parentCallback={indoorTempCallback} currentTemp={currentTemp} displaySymbol={temperatureSensor.display_symbol} thermostatState={thermostatState}/>
                <ThermostatSwitch ref={switchRef} parentCallback={switchCallback} currentTemp={currentTemp} desiredTemp={desiredTemp} autoStatus={autoON} outdoorSensor={outdoorSensor}/>
            </div>
          </div>
          <div className="secondary-stats">
            <h5>Full Version</h5>
            <div className="stats-display">
              <Humidity sensor={humiditySensor} sensorType={"Humidity"}/>
              <Humidity sensor={outdoorSensor} sensorType={"Outdoor"}/>
            </div>
          </div>
        </div>
        <div className="barchart-container container-center">
          <BarChart />
        </div>
      </div>
    </div>
  );
}

export default App;
