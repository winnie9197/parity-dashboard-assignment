import { useEffect, useState, useRef } from 'react';
import './App.css';
import IndoorTemp from './components/indoorTemp';
import ThermostatSwitch from './components/thermostatSwitch';

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
  const [ outdoorTemp, setOutdoorTemp ] = useState(0);
  const [ autoON, setAutoON ] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await fetchSensors();
      await registerApp();
    };
    prepare();
  }, []);

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

  const fetchSensors = async () => {
    const sensorUrl = 'http://api-staging.paritygo.com/sensors/api/sensors/';
    
    try {
      const response = await fetch(sensorUrl, {
        method: 'GET',
      });
      const data = await response.json();
      console.log('Success:', data);
      
      setHumiditySensor(data[0]);
      setTemperatureSensor(data[1]);
      setOutdoorSensor(data[2]);
      console.log(data[2]);
      console.log(outdoorSensor);

        //fetchTemperature
      if (data[1] !== undefined && Object.keys(data[1]).length !== 0) {
        console.log(data[1], 'sensor');
        if (currentTemp == 0) {
          fetchTemperature(data[1]);
        }
        fetchOutdoorTemp(data[2]);
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
          console.log(data.data_points);

          if (data.data_points && data.data_points.length >= 3) {
              const len = data.data_points.length;
              var sum = 0;

              for (var i=0; i<len; i++) {
                  sum += parseFloat(data.data_points[i].value);
              }
              
              const startTemp = Math.round((sum/ len)* 10) / 10;
              console.log(startTemp);
              setCurrentTemp(startTemp);
          } else {
              console.error("There's a missing data point for the current temperature.");

              // use latest data point as replacement
              setCurrentTemp(sensorData.latest_value);
            }
          } catch (error) {
              console.error('Error:', error);
          };
    }
  }

  const fetchOutdoorTemp = async (sensorData) => {
    console.log(sensorData);

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMinutes(endDate.getMinutes() - 15);

    if (sensorData !== undefined) {
        const sensorSlug = sensorData.slug;
        console.log("hey it works");

        const outdoorTempUrl = `http://api-staging.paritygo.com/sensors/api/sensors/${sensorSlug}/?begin=${startDate.toISOString()}&end=${endDate.toISOString()}`;

        try {
            const response = await fetch(outdoorTempUrl, {
            method: 'GET',
        });
            const data = await response.json();

            if (data.data_points && data.data_points.length >= 3) {
                const len = data.data_points.length;

                var sum = 0;

                for (var i=0; i<len; i++) {
                    sum += parseFloat(data.data_points[i].value);
                }
                

                const newTemp = Math.round((sum/ len)* 10) / 10;
                console.log(newTemp);
                setOutdoorTemp(newTemp);
            } else {
                console.error("There's a missing data point for the current outdoor temperature.");

                setOutdoorTemp(sensorData.latest_value);
            }
        } catch (error) {
            console.error('Error:', error);
        };
    }
}

  const switchRef = useRef();
  const indoorTempCallback = (autoStatus, desiredTemp) => {

    setAutoON(autoStatus);
    switchRef.current.handleAuto();
    setDesiredTemp(desiredTemp);
    
    // get most recent current temperature
    // const newCurrentTemp = await fetchTemperature(temperatureSensor);

    console.log(autoStatus, "manualParent");
    console.log(desiredTemp, "currentTemp");
  }

  const switchCallback = (newState) => {
    setThermostatState(newState);
  }

  
  return (
    <div className="App app-container">
      <div className="main-container">
        <h2 className="main-heading">Unit #100</h2>
        <div className="temp-container"> 
            <IndoorTemp parentCallback={indoorTempCallback} currentTemp={currentTemp} displaySymbol={temperatureSensor.display_symbol} autoStatus={autoON} thermostatState={thermostatState}/>
            <ThermostatSwitch ref={switchRef} parentCallback={switchCallback} currentTemp={currentTemp} desiredTemp={desiredTemp} outdoorTemp={outdoorTemp}/>
        </div>
      </div>
    </div>
  );
}

export default App;
