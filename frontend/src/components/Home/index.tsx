import axios, { AxiosError } from "axios";
import React, { useContext, useState } from "react";
import { ActionTypes, AppContext, IUser } from "../../contexts/AppContext";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";

const Home = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);

  const SCREENS = {
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    USER_INFO: "USER_INFO",
  };

  const [screen, setScreen] = useState(SCREENS.LOGIN);

  const performLogin = async (
    email: string,
    password: string,
    callback: (hasError: boolean, errorMessage: string) => void
  ) => {
    interface LoginResponse {
      user: IUser;
      token: string;
    }

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        }
      );
      if (response.status !== 200) {
        console.log("Unexpected status code:", response.status);
        callback(true, "Login Failed.");
        return;
      }
      const user = response.data.user;
      const token = response.data.token;
      dispatch({
        type: ActionTypes.LOGIN,
        loginInfo: { user, token },
      });
      callback(false, "");
      setScreen(SCREENS.USER_INFO);
    } catch (error) {
      const response = (error as AxiosError).response;
      if (response && response.data) {
        console.log("Error performing login:", response.data.message);
        callback(true, "Invalid Email or Password.");
      } else {
        console.log("Error performing login:", error);
        callback(true, "Login Failed.");
      }
    }
    return;
  };

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
              <FormLogin performLogin={performLogin} />
            </div>
          );
        }
      case SCREENS.REGISTER:
        return (
          <div>
            <h2 className="text-2xl text-center">Register</h2>
            <p className="pt-2 text-sm text-center">
              Already have an account?{" "}
              <a
                href=""
                className="link"
                onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  setScreen(SCREENS.LOGIN);
                }}
              >
                Login here.
              </a>
            </p>
            <FormRegister onRegister={() => setScreen(SCREENS.LOGIN)} />
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
