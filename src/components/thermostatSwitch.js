import { useEffect, useState } from "react";

function ThermostatSwitch () {
    const [ thermostatON, setThermostatON ] = useState(false);
    const [ autoON, setAutoON ] = useState(false);  //only checked with heating and cooling to represent states
    const [ heatON, setHeatON ] = useState(false);
    const [ coolON, setCoolON ] = useState(false);

    const uid = localStorage.getItem('uid');
    const thermostatUrl = `https://api-staging.paritygo.com/sensors/api/thermostat/${uid}/`;

    useEffect(() => {
        getStatus();
    }, []);

    const handleThermostat = async () => {
        //send request to persist
        if(!newStatus) {
            await changeStatus('off');
        } else {
            await changeStatus('auto_standby');
        }

        //update component states
        const newStatus = !thermostatON;
        setThermostatON(newStatus);

        
    }

    const handleAuto = () => {
        const newStatus = !autoON;
        setAutoON(newStatus);

        // should first check temperature diffs (between indoor and outdoor), then assign a param and persist that data

        //
    }

    const handleHeat = async () => {
        //persist changes

        // if heat turns on, auto turns off
        // if heat turns off, if auto is on then let auto function handle it
        // if auto is off then turn thermostat off
        // await changeStatus('heat');

        //change component states
        const newStatus = !heatON;

        if (newStatus && coolON) {
            setCoolON(false);
        }
        setHeatON(newStatus);

        
    }

    const handleCool = async () => {
        //persist changes
        await changeStatus('cool');

        //change component states
        const newStatus = !coolON;

        if (newStatus && heatON) {
            setHeatON(false);
        }
        setCoolON(newStatus);
    }

    // The patch request doesn't change persistent data@!!!
    const changeStatus = async (newState) => {
        console.log(newState, "this is new state");
        await fetch(thermostatUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( { "state": newState } ),
          }).then(response => response.json())
          .then(data => {
              console.log('New status', data);
              
              console.log(data.state);
          }).catch(error => {
            console.error('Error:', error);
          });
    }

    const getStatus = async () => {

        await fetch(thermostatUrl, {
          method: 'GET',
        }).then(response => response.json())
        .then(data => {
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


            console.log(data.state, "new status");

        }).catch(error => {
          console.error('Error:', error);
        });
    }

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

    const handleSwitch = async (tempState) => {
        console.log(tempState, 'tempstate');
        // get tempstate from user input, 
        switch(tempState) {
            case "heat":
                console.log("it's heat");
                await handleHeat();
                break;
            case "cool":
                await handleCool();
                break;
            case "thermostat":
                await handleThermostat();
                break;
            case "auto":
                await handleAuto();
                break;
            default:
                console.error("Something's not right");
        }

        // getStatus();
    }

    return (
        <div className="container-center">
            <div className="switches">
                <button onClick={() => handleSwitch("thermostat")}>{thermostatON ? <h4>OFF</h4> : <h4>ON</h4> }</button>
                <button onClick={() => handleSwitch("auto")}>{renderAuto()}</button>
                <div className="inline-switches">
                    <button onClick={() => handleSwitch("heat")}>{renderHeat()}</button>/
                    <button onClick={() => handleSwitch("cool")}>{renderCool()}</button>
                </div>

            </div>
        </div>
        
    );
};


export default ThermostatSwitch;
