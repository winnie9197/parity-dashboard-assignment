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
    <div className="App app-container">
      <div className="main-container">
        <h2 className="main-heading">Unit #100</h2>
        <div className="temp-container"> 
            <IndoorTemp sensor={temperatureSensor}/>
            <ThermostatSwitch />
        </div>
      </div>
    </div>
  );
}

export default App;
