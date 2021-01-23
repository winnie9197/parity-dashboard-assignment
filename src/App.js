import { useEffect, useState } from 'react';
import './App.css';
import IndoorTemp from './components/indoorTemp';
import Humidity from './components/humidity';

function App() {
  const [ sensors, setSensors ] = useState([]);

  const [ humiditySensor, setHumiditySensor ] = useState({});
  const [ temperatureSensor, setTemperatureSensor ] = useState({});
  const [ outdoorSensor, setOutdoorSensor ] = useState({});

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
    fetchSensors();
  }, []);
  
  return (
    <div className="App">
      <div className="boxes-container"> 
          <div className="boxes">1</div>
          <div className="boxes">2</div>
          <div className="boxes filler"></div>  
          <div className="boxes"><Humidity sensor={outdoorSensor} sensorType={"OUTDOOR"}/></div>
          <div className="boxes"><IndoorTemp sensor={temperatureSensor}/></div>
          <div className="boxes">6</div>  
          <div className="boxes"><Humidity sensor={humiditySensor} sensorType={"HUMIDITY"}/></div>
          <div className="boxes filler"></div>
          <div className="boxes">9</div>  
        {/* <table className="boxes-layout">
          <tbody>
            <tr>
              <td><div>Firstname</div></td>
              <td><div>Firstname</div></td>
              <td className="filler"><div></div></td>
            </tr>
            <tr>
              <td>Jill</td>
              <td><IndoorTemp /></td>
              <td>50</td>
            </tr>
            <tr>
              <td>Eve</td>
              <td>Jackson</td>
              <td>94</td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
}

export default App;
