import { useEffect, useState, useRef } from 'react';

function IndoorTemp ({ parentCallback, currentTemp, displaySymbol, thermostatState }) {
    const [ desiredTemp, setDesiredTemp ] = useState(0);

    useEffect(() => {
        setDesiredTemp(currentTemp);
    }, [currentTemp]);

    // handle Desired Temperatues
    function handleIncrement() {
        const dT = desiredTemp+0.5;
        setDesiredTemp(dT);
        
        // update actual thermometer
        parentCallback(true, dT);
    }

    function handleDecrement() {
        const dT = desiredTemp-0.5;
        setDesiredTemp(dT);

        // update actual thermometer
        parentCallback(true, dT);
    }

    return (
        <div className="container-center">
            <h4 className="title">Indoor Temperature</h4>
            <h5 className="status">{thermostatState.toUpperCase()}</h5>
            <div className="indoor-temp">
                
                {/* // Temperature values can also be optionally rounded to the nears .5, with Math.round(desiredTemp*2)/2 */} 
                <h1 className="start-temp">{desiredTemp}{displaySymbol!==undefined ? displaySymbol : "°C"}</h1>
                <div className="temp-buttons">
                    <button className="square" onClick={e => handleIncrement()}>+<sub>0.5</sub></button>
                    <button className="square" onClick={e => handleDecrement()}>-<sub>0.5</sub></button>
                </div>
                
            </div>


        </div>
    );
};


export default IndoorTemp;
