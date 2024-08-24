// src/App.js
import React from 'react';
import './index.css';
import PilotLocator from './components/map-component';
import logo from '../src/assets/logo.png';


function App() {
    return (
        <div className="App">
          <img src={logo} alt="smart flying logo"width="75px" height="75px" align="left"></img>
            <PilotLocator />
        </div>
    );
}

export default App;
