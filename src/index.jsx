import "./main.scss";
import React from "react";
import ReactDOM from "react-dom";
// Redux
import { Provider } from "react-redux";
import store from "./app/redux/store";
// Toast utilities
import { ToastProvider } from "react-toast-notifications";
// Components
import Navbar from "./app/components/navbar";
import Sidebar from "./app/components/sidebar";
import Dashboard from "./app/components/dashboard";
import Footer from "./app/components/footer";

'use strict';

const getBackground = state => {
  return state.settings.currentBackground.url;
};

let style = {
  background: getBackground(store.getState()),
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
};

store.subscribe(() => {
  let state = store.getState();
  let bgUrl = getBackground(state);
  if (bgUrl != style.background) {
    style = Object.assign(style, {background: bgUrl});
  }
});

const domContainer = document.querySelector('#react-app');
ReactDOM.render(
  <Provider store={store}>
    <ToastProvider autoDismiss={true} autoDismissTimeout={10000}>
      <div className="container-fluid px-0 bg-light">
        <Navbar />
        <div className="row mx-0">
          <div className="col-4">
            <Sidebar />
          </div>
          <div className="col-8 px-0 border-start dashboard" style={style}>
            <Dashboard />
          </div>
        </div>
      </div>
    </ToastProvider>
  </Provider>, domContainer
);

