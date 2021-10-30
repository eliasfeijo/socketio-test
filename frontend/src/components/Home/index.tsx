import React, { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import FormLogin from "./FormLogin";

const Home = (): JSX.Element => {
  const { state } = useContext(AppContext);

  const SCREENS = {
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    USER_INFO: "USER_INFO",
  };

  const [screen, setScreen] = useState(SCREENS.LOGIN);

  const renderHome = () => {
    switch (screen) {
      case SCREENS.LOGIN:
        if (!state.token || !state.user) {
          return (
            <div>
              <h2 className="text-2xl text-center">Login</h2>
              <p className="pt-2 text-sm text-center">
                Don't have an account?{" "}
                <a
                  href=""
                  className="link"
                  onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                    event.preventDefault();
                    setScreen(SCREENS.REGISTER);
                  }}
                >
                  Register here.
                </a>
              </p>
              <FormLogin onLogin={() => setScreen(SCREENS.USER_INFO)} />
            </div>
          );
        }
      case SCREENS.REGISTER:
        return (
          <div>
            <h2>Register</h2>
          </div>
        );
      case SCREENS.USER_INFO:
      default:
        if (state.user && state.token) {
          return (
            <div>
              <h2 className="text-2xl text-center">
                Welcome <b>{state.user.name}</b>
              </h2>
            </div>
          );
        }
        setScreen(SCREENS.LOGIN);
        return null;
    }
  };

  return (
    <div className="flex justify-center align-center items-center h-full">
      {renderHome()}
    </div>
  );
};

export default Home;
