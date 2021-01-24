import { useEffect, useState, useRef } from 'react';

function Humidity ({ sensor, sensorType }) {
    const [ startHumidity, setStartHumidity ] = useState(0);
    
    const fetchHumidity = (sensorData) => {
        console.log(sensorData);

        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setMinutes(endDate.getMinutes() - 15);

        if (sensorData !== undefined) {
            const sensorSlug = sensorData.slug;

            const humidityUrl = `http://api-staging.paritygo.com/sensors/api/sensors/${sensorSlug}/?begin=${startDate.toISOString()}&end=${endDate.toISOString()}`;

            fetch(humidityUrl, {
                method: 'GET',
            }).then(response => response.json())
            .then(d => {
                // console.log(d.data_points, 'humidity');

                if (d.data_points && d.data_points.length >= 3) {
                    const len = d.data_points.length;

                    var sum = 0;

                    for (var i=0; i<len; i++) {
                        sum += parseFloat(d.data_points[i].value);
                    }

                    const currentHumidity = Math.round((sum/ len)* 10) / 10;
                    setStartHumidity(currentHumidity);
                } else {
                    console.error("There's a missing data point for the current humidity.");
                }
            }).catch(error => {
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
            console.log(sensor,'sensor');
            if (sensor !== undefined && Object.keys(sensor).length !== 0)
                console.log(sensor,'sensor');
                fetchHumidity(sensor);
        }
    });
    

    return (
        <div className="container-center">
            <div className="humidity">
                <h3 className="startTemp">{startHumidity}{sensor!==undefined ? sensor.display_symbol : "%"}</h3>
                <h5 className="sub-text">{sensorType}</h5>
            </div>
        </div>
        
    );
};


export default Humidity;
