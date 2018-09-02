import React, { Component } from 'react';
import logo from './logo.svg';
import Navigation from './Navigation';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React Fun Maps</h1>
        </header>
        <Navigation />
      </div>
    );
  }
}

export default App;
