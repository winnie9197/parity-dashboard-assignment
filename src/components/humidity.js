import { useEffect, useState, useRef } from 'react';

function Humidity ({ sensor, sensorType }) {
    const [ startHumidity, setStartHumidity ] = useState(0);
    
    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            // do componentDidMount logic
            mounted.current = true;
        } else {
            // do componentDidUpdate logic
            if (sensor !== {} && Object.keys(sensor).length > 0) {
                fetchHumidity(sensor);
            }
        }
    },[sensor]);

    // Fetch Humidity Data
    const fetchHumidity = async (sensorData) => {
        console.log(sensorData);

        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setMinutes(endDate.getMinutes() - 15);

        if (sensorData !== undefined) {
            const sensorSlug = sensorData.slug;

            const humidityUrl = `http://api-staging.paritygo.com/sensors/api/sensors/${sensorSlug}/?begin=${startDate.toISOString()}&end=${endDate.toISOString()}`;
            try {
                const response = await fetch(humidityUrl, {
                    method: 'GET',
                }); 
                const data = await response.json();
            
                if (data.data_points && data.data_points.length >= 3) {
                    const len = data.data_points.length;

                    var sum = 0;

                    for (var i=0; i<len; i++) {
                        sum += parseFloat(data.data_points[i].value);
                    }

                    const currentHumidity = Math.round((sum/ len)* 10) / 10;
                    setStartHumidity( Math.round(currentHumidity* 10) / 10);
                } else {
                    console.error(`There's a missing data point for the current ${sensorType}.`);
                }
            } catch (error) {
                console.error('Error:', error);
            };
        }
    }    

    return (
            <div className="humidity">
                <h4 className="sub-text">{sensorType}</h4><h2 className="startTemp">{startHumidity}{sensor!==undefined ? sensor.display_symbol : "%"}</h2>
            </div>
    );
};


export default Humidity;
