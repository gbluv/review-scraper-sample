import React, { Component } from 'react';
import './App.css';
import ToothsSenger from './ToothsSenger';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Scrape </h1>
        </header>

        <ToothsSenger/>
      </div>
    );
  }
}

export default App;


