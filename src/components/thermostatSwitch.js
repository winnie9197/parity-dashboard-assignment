import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

const ThermostatSwitch = forwardRef(({ parentCallback, currentTemp, desiredTemp, outdoorSensor, autoStatus}, ref) => {
    const [ thermostatON, setThermostatON ] = useState(false);
    const [ autoON, setAutoON ] = useState(false);  //only checked with heating and cooling to represent states
    const [ heatON, setHeatON ] = useState(false);
    const [ coolON, setCoolON ] = useState(false);

    const [ outdoorTemp, setOutdoorTemp ] = useState(0);

    const uid = localStorage.getItem('uid');
    const thermostatUrl = `https://api-staging.paritygo.com/sensors/api/thermostat/${uid}/`;

    useEffect(() => {
        getStatus(); 
    }, []);

    useEffect(() => {
        setAutoON(autoStatus);
        handleAuto(true);
    }, [autoStatus, desiredTemp]);

    // Handle Click events
    useImperativeHandle(ref, () => ({

        fetchOutdoorTemp() {
            fetchOutdoorTemp();
        }

    }));

    const handleAuto = async (newStatus) => {
        var newState = "";
        if (newStatus === false) {
            // if auto is off
            if (heatON) {
                newState = 'heat';
            } else if (coolON && outdoorTemp >= 0) {
                // cooling cannot happen if outside_temp is below 0 degrees celcius
                newState = 'cool';
            } else {
                //anything else
                newState = 'auto_standby';
            }

        } else {
            // if auto is ON, detect temperature diffs
            if (currentTemp < desiredTemp) {
                //heating
                newState = 'auto_heat';

            } else if (currentTemp > desiredTemp && outdoorTemp >= 0) {
                //cooling
                newState = 'auto_cool';
            } else {
                //auto_standby
                newState = 'auto_standby';
            }

            await changeStatus(newState);
        }
        setAutoON(newStatus);
    }

    const handleThermostat = async () => {
        //send request to persist
        const newStatus = !thermostatON;
        if (newStatus === false) {
            await changeStatus('off');
            //Also need to disable other bottons
            setAutoON(false);
            setHeatON(false);
            setCoolON(false);
        } else {
            //Default ON is auto_standby
            await changeStatus('auto_standby');

            setAutoON(true);
            setHeatON(false);
            setCoolON(false);
        }
        //update component state
        setThermostatON(newStatus);
    }

    const handleManual = (action, newState) => {
        action(newState);
        setAutoON(false);
    }

    const handleHeat = async (newState) => {
        //persist changes
        await changeStatus(newState);

        // if heat turns on, auto turns off
        // if heat turns off, if auto is on then let auto function handle it
        // if auto is off then turn thermostat off

        //change component states
        const newStatus = !heatON;

        if (newStatus && coolON) {
            setCoolON(false);
        }
        setHeatON(newStatus);
    }

    const handleCool = async (newState) => {
        if (outdoorTemp >= 0) {
            //persist changes
            await changeStatus(newState);
            //change component states
            const newStatus = !coolON;

            if (newStatus && heatON) {
                setHeatON(false);
            }
            setCoolON(newStatus);
        }
    }


    const handleSwitch = async (tempState) => {

        // get tempstate from user input, 
        switch(tempState) {
            case "heat":
                await handleManual(handleHeat,'heat');
                break;
            case "cool":
                await fetchOutdoorTemp(outdoorSensor);
                await handleManual(handleCool,'cool');
                break;
            case "thermostat":
                await handleThermostat();
                break;
            case "auto":
                var newStatus;
                if (!autoStatus)
                    newStatus = !autoON;
                else 
                    newStatus = true;
                await handleAuto(newStatus);
                break;
            default:
                console.error("Something's not right");
        }
    }


    // ^^^^^^^ Handle Click events END ^^^^^^^

    const changeStatus = async (newState) => {
        try {
            const response = await fetch(thermostatUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( { "state": newState } ),
            });
            const data = await response.json();
            console.log('New status', data);
            parentCallback(data.state);
          } catch (error) {
            console.error('Error:', error);
          };
    }

    const getStatus = async () => {
        try {
            const response = await fetch(thermostatUrl, {
            method: 'GET',
            });
            const data = await response.json();
        
            console.log('Init Status:', data);

            // initialize states by "switch" block to save states separately
            switch(data.state) {
                case "off":
                    setThermostatON(false);
                    setAutoON(false);
                    setHeatON(false);
                    setCoolON(false);
                    break;
                case "heat":
                    setThermostatON(true);
                    setAutoON(false);
                    setHeatON(true);
                    setCoolON(false);
                    break;
                case "cool":
                    setThermostatON(true);
                    setAutoON(false);
                    setHeatON(false);
                    setCoolON(true);
                    break;
                case "auto_heat":
                    setThermostatON(true);
                    setAutoON(true);
                    setHeatON(true);
                    setCoolON(false);
                    break;
                case "auto_cool":
                    setThermostatON(true);
                    setAutoON(true);
                    setHeatON(false);
                    setCoolON(true);
                    break;
                case "auto_standby":
                    setThermostatON(true);
                    setAutoON(true);
                    setHeatON(false);
                    setCoolON(false);
                    break;
                default:
                    console.error("Something's not right");
            }

            parentCallback(data.state);
        } catch (error){
          console.error('Error:', error);
        };
    }

    const fetchOutdoorTemp = async (sensorData) => {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setMinutes(endDate.getMinutes() - 15);

        if (sensorData !== undefined) {
            const sensorSlug = sensorData.slug;

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

    // Render component
    const renderAuto = () => {
        const displayColor = autoON ? "#16bcc8" : "#BCBCBC";
        return (<h4 style={{color:`${displayColor}`}}>AUTO</h4>);
    }

    const renderHeat = () => {
        const displayColor = heatON ? "#16bcc8" : "#BCBCBC";
        return (<h4 style={{color:`${displayColor}`}}>HEAT</h4>);
    }

    const renderCool = () => {
        const displayColor = coolON ? "#16bcc8" : "#BCBCBC";
        return (<h4 style={{color:`${displayColor}`}}>COOL</h4>);
    }

    const renderThermostatSwitch = () => {
        const displayColor = thermostatON ? "#BCBCBC" : "#16bcc8";
        const text = thermostatON ? "ON" : "OFF";
        return (<h4 style={{color:`${displayColor}`}}>{text}</h4>);
    }

    // ^^^^^^ Render component END ^^^^^^

    return (
        <div className="container-center">
            <div className="switches">
                <button onClick={() => handleSwitch("thermostat")}>{renderThermostatSwitch()}</button>
                <button disabled={true}>{renderAuto()}</button>
                <div className="inline-switches">
                    <button onClick={() => handleSwitch("heat")}>{renderHeat()}</button>/
                    <button onClick={() => handleSwitch("cool")}>{renderCool()}</button>
                </div>

            </div>
        </div>
        
    );
}
);


export default ThermostatSwitch;
