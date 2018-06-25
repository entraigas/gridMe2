import React, { Component } from 'react';
import { Provider } from "react-redux";
// custom
import configureStore from "./rootReducers";
import './App.css';
import IndexPlayers from './players/index';

const store = configureStore();

class App extends Component {

  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <IndexPlayers/>
      </div>
      </Provider>
    );
  }
}


export default App;
