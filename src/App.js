import './App.css';
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/"/>
          <Route path="/about"/>
          <Route path="/contact"/>

        </Routes>
      </Router>

    </>
  );
}


export default App;
