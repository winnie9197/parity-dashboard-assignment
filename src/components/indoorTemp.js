import { useEffect, useState, useRef } from 'react';

function IndoorTemp ({ sensor }) {
    const [ startTemp, setStartTemp ] = useState(0);
    const [ manual, setManual ] = useState(false);

    const fetchTemperature = (sensorData) => {
        console.log(sensorData, "temp");
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setMinutes(endDate.getMinutes() - 15);

        if (sensorData !== undefined) {
            const sensorSlug = sensorData.slug;

            const temperatureUrl = `http://api-staging.paritygo.com/sensors/api/sensors/${sensorSlug}/?begin=${startDate.toISOString()}&end=${endDate.toISOString()}`;

            fetch(temperatureUrl, {
                method: 'GET',
            }).then(response => response.json())
            .then(d => {
                console.log(d.data_points);

                if (d.data_points && d.data_points.length >= 3) {
                    const len = d.data_points.length;

                    var sum = 0;

                    for (var i=0; i<len; i++) {
                        sum += parseFloat(d.data_points[i].value);
                    }
                    
                    const currentTemp = Math.round((sum/ len)* 10) / 10;
                    console.log(currentTemp);
                    setStartTemp(currentTemp);
                    setManual(false);
                } else {
                    console.error("There's a missing data point for the current temperature.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            // do componentDidMount logic
            mounted.current = true;
        } else {
            // do componentDidUpdate logic
            console.log(sensor, 'sensor');
            if (sensor !== undefined && Object.keys(sensor).length !== 0) {
                console.log(sensor, 'sensor');
                if (!manual)
                    fetchTemperature(sensor);
            }
        }
    });

    useEffect(() => {
    }, [sensor]);

    function handleIncrement() {
        setStartTemp(startTemp+0.5);
        setManual(true);
        // update actual thermometer
    }

    function handleDecrement() {
        setStartTemp(startTemp-0.5);
        setManual(true);
        // update actual thermometer
    }

    return (
        <div className="container-center">
            <div className="indoorTemp">
                <h1 className="startTemp">{startTemp}{sensor!==undefined ? sensor.display_symbol : "°C"}</h1>
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
