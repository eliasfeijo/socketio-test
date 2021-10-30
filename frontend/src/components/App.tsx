import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "../contexts/AppContext";
import "./App.css";
import Footer from "./Footer";
import About from "./About";
import Home from "./Home";

const App = (): JSX.Element => (
  <Router>
    <div className="h-full flex flex-col">
      <h1 className="pt-4 px-4 text-4xl text-center">Chat Application</h1>
      <div className="pb-4 pt-4 h-full">
        <AppProvider>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </AppProvider>
      </div>
      <div className="flex-1" />
      <Footer />
    </div>
  </Router>
);

export default App;
