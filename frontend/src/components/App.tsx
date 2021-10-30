import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { TodosProvider } from "../contexts/TodosContext";
import "./App.css";
import Footer from "./Footer";
import About from "./About";
import Home from "./Home";

const App = (): JSX.Element => (
  <Router>
    <div className="h-full flex flex-col">
      <h1 className="pt-4 px-4 text-4xl text-center">Chat Application</h1>
      <div className="pb-4 pt-4">
        <TodosProvider>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </TodosProvider>
      </div>
      <div className="flex-1" />
      <Footer />
    </div>
  </Router>
);

export default App;
