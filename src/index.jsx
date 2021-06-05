import "./main.scss";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { StyledInlineLoader } from "./app/loaders";
// Redux
import { Provider } from "react-redux";
import store from "./app/redux/store";
// Toast utilities
import { ToastProvider } from "react-toast-notifications";
// Components
import Navbar from "./app/components/navbar";
import Sidebar from "./app/components/sidebar";
import Footer from "./app/components/footer";

const LazyDashboard = React.lazy(() => import("./app/components/dashboard"));

'use strict';

const domContainer = document.querySelector('#react-app');
ReactDOM.render(
  <Provider store={store}>
    <ToastProvider autoDismiss={true} autoDismissTimeout={10000}>
      <div className="container-fluid px-0 bg-light">
        <Navbar />
        <div className="row mx-0 main-wrapper">
          <div className="col-12 col-md-4">
            <Sidebar />
          </div>
          <div className="col-12 col-md-8 px-0 border-md-start dashboard">
            <Suspense fallback={<StyledInlineLoader />}>
              <LazyDashboard />
            </Suspense>
          </div>
        </div>
      </div>
    </ToastProvider>
  </Provider>, domContainer
);

