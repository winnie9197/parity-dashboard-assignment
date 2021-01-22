import { useEffect, useState } from 'react';

function IndoorTemp () {
    //Change: get indoor data => 
    const [ startTemp, setStartTemp ] = useState(0);
    const [ sensors, setSensors ] = useState([]);

    const fetchSensors = () => {
        const sensorUrl = 'http://api-staging.paritygo.com/sensors/api/sensors/';
        
        fetch(sensorUrl, {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            
            setSensors(data);

            fetchTemperature(data);
        }).catch(error => {
          console.error('Error:', error);
        });
    }

    const fetchTemperature = (sensorData) => {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setMinutes(endDate.getMinutes() - 15);
        const sensorSlug = sensorData[1].slug;

        const temperatureUrl = `http://api-staging.paritygo.com/sensors/api/sensors/${sensorSlug}/?begin=${startDate.toISOString()}&end=${endDate.toISOString()}`;

        fetch(temperatureUrl, {
            method: 'GET',
        }).then(response => response.json())
        .then(d => {
            // console.log(d.data_points);

            if (d.data_points && d.data_points.length >= 3) {
                const len = d.data_points.length;

                var sum = 0;

                for (var i=0; i<len; i++) {
                    sum += parseFloat(d.data_points[i].value);
                }

                console.log(Math.round((sum/ len)* 10) / 10);
                
                const currentTemp = Math.round((sum/ len)* 10) / 10;
                setStartTemp(currentTemp);
            } else {
                console.error("There's a missing data point for the current temperature.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        fetchSensors();
    },[]);

    useEffect(() => {

     }, [sensors]);

    function handleIncrement() {
        setStartTemp(startTemp+0.5);

        // update actual thermometer
    }

    function handleDecrement() {
        setStartTemp(startTemp-0.5);

        // update actual thermometer
    }

    return (
        <div className="container-center">
            <div className="indoorTemp">
                <h1 className="startTemp">{startTemp}&#176;C</h1>
                <div>
                    <button onClick={handleIncrement}>+0.5</button>
                    <button onClick={handleDecrement}>-0.5</button>
                </div>
                <h5 className="sub-text">INDOOR TEMPERTURE</h5>
            </div>
        </div>
    );
};


export default IndoorTemp;
