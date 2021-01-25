import { useEffect, useState, useRef } from 'react';

function IndoorTemp ({ parentCallback, currentTemp, displaySymbol, autoStatus, thermostatState }) {
    const [ desiredTemp, setDesiredTemp ] = useState(0);

    useEffect(() => {
        setDesiredTemp(currentTemp);
        console.log(currentTemp, "currentTemp");
        console.log(desiredTemp, "desiredTemp");
    }, [currentTemp]);

    // handle Desired Temperatues
    function handleIncrement() {
        setDesiredTemp(desiredTemp+0.5);
        // update actual thermometer
        parentCallback(true, desiredTemp);
    }

    function handleDecrement() {
        setDesiredTemp(desiredTemp-0.5);
        // update actual thermometer
        parentCallback(true, desiredTemp);
    }

    return (
        <div className="container-center">
            <h4 className="title">Indoor Temperature</h4>
            <h5 className="status">{thermostatState.toUpperCase()}</h5>
            <div className="indoor-temp">
                
                {/* // Temperature values are rounded to the nears .5 */}
                <h1 className="start-temp">{Math.round(desiredTemp*2)/2}{displaySymbol!==undefined ? displaySymbol : "°C"}</h1>
                <div className="temp-buttons">
                    <button className="square" onClick={e => handleIncrement()}>+<sub>0.5</sub></button>
                    <button className="square" onClick={e => handleDecrement()}>-<sub>0.5</sub></button>
                </div>
                
            </div>


        </div>
    );
};


export default IndoorTemp;
