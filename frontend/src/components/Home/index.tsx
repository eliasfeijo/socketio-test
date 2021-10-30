import React, { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import FormLogin from "./FormLogin";

const Home = (): JSX.Element => {
  const { state } = useContext(AppContext);

  const renderHome = () => {
    if (!state.token || !state.user) {
      return (
        <div>
          <h2 className="text-2xl text-center">Login</h2>
          <FormLogin />
        </div>
      );
    }
    return (
      <div>
        <h2 className="text-2xl text-center">
          Welcome <b>{state.user.name}</b>
        </h2>
      </div>
    );
  };

  return (
    <div className="flex justify-center align-center items-center h-full">
      {renderHome()}
    </div>
  );
};

export default Home;
