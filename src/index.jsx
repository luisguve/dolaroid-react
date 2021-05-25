import "./main.scss";
import React from "react";
import ReactDOM from "react-dom";
// Redux
import { Provider } from "react-redux";
import store from "./app/redux/store";
// Components
import Navbar from "./app/components/navbar";
import Sidebar from "./app/components/sidebar";
import Dashboard from "./app/components/dashboard";
import Footer from "./app/components/footer";

'use strict';

const domContainer = document.querySelector('#react-app');
ReactDOM.render(
  <Provider store={store}>
    <div className="container-fluid px-0 bg-light">
      <Navbar />
    </div>
    <div className="container">
      <Sidebar />
      <Dashboard />
    </div>
    <Footer />
  </Provider>, domContainer
);

