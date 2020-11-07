import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import bookFacade from "./bookFacade";
import { BrowserRouter as Router } from "react-router-dom";

const AppWithRouter = () => {
  return (
    <Router>
      <App bookFacade={bookFacade} />
    </Router>
  );
};
ReactDOM.render(<AppWithRouter />, document.getElementById("root"));