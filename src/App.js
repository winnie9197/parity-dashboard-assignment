import { useEffect, useState } from 'react';
import './App.css';
import IndoorTemp from './components/indoorTemp';
import Humidity from './components/humidity';
import ThermostatSwitch from './components/thermostatSwitch';

function App() {
  const [ humiditySensor, setHumiditySensor ] = useState({});
  const [ temperatureSensor, setTemperatureSensor ] = useState({});
  const [ outdoorSensor, setOutdoorSensor ] = useState({});

  const [ thermostatStatus, setThermostatStatus ] = useState('');

  const registerApp = async () => {
    if (localStorage.getItem('uid') === null) {
      const registerUrl = 'https://api-staging.paritygo.com/sensors/api/thermostat/register/';

      await fetch(registerUrl, {
          method: 'POST',
      }).then(response => response.json())
      .then(data => {
          console.log('Registered:', data);

          // persist UID hash
          localStorage.setItem('uid', data.uid_hash);
          setThermostatStatus(data.state);
      }).catch(error => {
        console.error('Error:', error);
      });
    }
  }

  const fetchSensors = async () => {
    const sensorUrl = 'http://api-staging.paritygo.com/sensors/api/sensors/';
    
    await fetch(sensorUrl, {
        method: 'GET',
    }).then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        
        setHumiditySensor(data[0]);
        setTemperatureSensor(data[1]);
        setOutdoorSensor(data[2]);

    }).catch(error => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    registerApp();
    fetchSensors();
  }, []);
  
  return (
    <div className="App">
      <div className="boxes-container"> 
          <div className="boxes"></div>
          <div className="boxes filler"></div>
          <div className="boxes"></div>
          {/* <div className="boxes"><Humidity sensor={humiditySensor} sensorType={"HUMIDITY"}/></div> */}
          <div className="boxes"></div>
          {/* <div className="boxes"><h4>{thermostatStatus.toUpperCase()}</h4></div> */}
          <div className="boxes"><IndoorTemp sensor={temperatureSensor}/></div>
          {/* <div className="boxes"><Humidity sensor={outdoorSensor} sensorType={"OUTDOOR"}/></div>   */}
          <div className="boxes"></div>
          <div className="boxes"></div>
          <div className="boxes"><ThermostatSwitch /></div>
          <div className="boxes filler"></div>  
      </div>
    </div>
  );
}

export default App;
