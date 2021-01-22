import './App.css';
import IndoorTemp from './components/indoorTemp';

function App() {

  
  return (
    <div className="App">
      <div className="boxes-container"> 
          <div className="boxes">1</div>
          <div className="boxes">2</div>
          <div className="boxes filler">3</div>  
          <div className="boxes">4</div>
          <div className="boxes"><IndoorTemp /></div>
          <div className="boxes">6</div>  
          <div className="boxes">7</div>
          <div className="boxes filler">8</div>
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
