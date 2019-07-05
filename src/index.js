import React from "react"
import ReactDOM from "react-dom"
import { QueryParamProvider } from 'use-query-params';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import App from "./App";

import "react-toastify/dist/ReactToastify.css"

const root = document.querySelector("#root")

const render = () => {
  if (root) {
    ReactDOM.render(
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            <Route path="/countries" exact component={App} />
            <Redirect to="/countries" />
          </Switch>
        </QueryParamProvider>
      </BrowserRouter>,
      root,
    )
  }
}

render()
