import React, { useState } from 'react';
import Map from "./MapBox/mapbox";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import More from './Pages/More';
import About from './Pages/About';
import Login from './components/Login';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const accessToken = "pk.eyJ1IjoicHJvamVjdGtyaW9zIiwiYSI6ImNscjk2ZHI1bTAzNWUycW1sYmxwZzZmdGcifQ.fY69dsFyjhn23JecHNOSJQ"
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} toggleLogin={() => setIsLoggedIn(false)} />} />
        <Route path="/map" element={<Map accessToken={accessToken}/>} />
        <Route path='/about' element={<About isLoggedIn={isLoggedIn} toggleLogin={() => setIsLoggedIn(false)}/>} />
        <Route path="/more" element={<More isLoggedIn={isLoggedIn} toggleLogin={() => setIsLoggedIn(false)}/>} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />}/>
      </Routes>
    </Router>
  </div>
  );
}
export default App;