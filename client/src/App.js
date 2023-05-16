import './App.css';
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import FirstSection from './pages/FirstSection/FirstSection';
import SecondSection from './pages/SecondSection/SecondSection';
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
      <FirstSection/>
      <SecondSection/>
    
    </>
  );
}


export default App;
