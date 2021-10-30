import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Home = (): JSX.Element => {
  const { state } = useContext(AppContext);

  const renderHome = () => {
    if (!state.token || !state.user) {
      return (
        <div className="pt-6">
          <h2 className="text-2xl text-center">Login</h2>
        </div>
      );
    }
    return (
      <div className="pt-6">
        <p className="text-center"> Welcome {state.user.name}</p>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-center">Home</h2>
      {renderHome()}
    </div>
  );
};

export default Home;
