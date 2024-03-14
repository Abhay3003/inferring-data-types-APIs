import logo from './logo.svg';
import { BrowserRouter as Router } from 'react-router-dom';
import Wrapper from './components/Wrapper';
import './App.css';

function App() {

  return (
      <Router className="App">
        <Wrapper/>
      </Router>
  )
}
export default App;
