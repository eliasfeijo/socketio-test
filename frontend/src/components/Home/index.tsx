import axios, { AxiosError } from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { ActionTypes, AppContext, IUser } from "../../contexts/AppContext";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";

const Home = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);

  const history = useHistory();

  enum Screens {
    Login = "LOGIN",
    Register = "REGISTER",
    UserInfo = "USER_INFO",
  }

  const [screen, setScreen] = useState(Screens.Login);

  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

  const performRefreshToken = useCallback(
    async (oldToken) => {
      interface RefreshTokenResponse {
        user: IUser;
        token: string;
      }

      try {
        const response = await axios.post<RefreshTokenResponse>(
          "http://localhost:3000/api/refreshToken",
          {},
          {
            headers: {
              Authorization: `Bearer ${oldToken}`,
            },
          }
        );
        if (response.status !== 200) {
          console.log("Unexpected status code:", response.status);
          return;
        }
        const user = response.data.user;
        const token = response.data.token;
        dispatch({
          type: ActionTypes.LOGIN,
          loginInfo: { user, token },
        });
        const cookieExpires = new Date();
        cookieExpires.setHours(cookieExpires.getHours() + 11);
        const lastLogin = Date.now();
        setCookie(
          "auth",
          { user, token, lastLogin },
          {
            path: "/",
            expires: cookieExpires,
          }
        );
        setScreen(Screens.UserInfo);
      } catch (error) {
        console.log("Error performing refreshToken:", error);
        removeCookie("auth", { path: "/" });
      }
      return;
    },
    [Screens.UserInfo, dispatch, removeCookie, setCookie]
  );

  useEffect(() => {
    if (cookies.auth) {
      const { user, token, lastLogin } = cookies.auth;
      if (Date.now() - lastLogin > 1000 * 60 * 60) {
        performRefreshToken(token);
      } else {
        dispatch({
          type: ActionTypes.LOGIN,
          loginInfo: { user, token },
        });
        setScreen(Screens.UserInfo);
      }
    }
  }, [Screens.UserInfo, cookies.auth, dispatch, performRefreshToken]);

  const performLogout = () => {
    removeCookie("auth", { path: "/" });
    dispatch({ type: ActionTypes.LOGOUT });
    setScreen(Screens.Login);
  };

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
      const cookieExpires = new Date();
      cookieExpires.setHours(cookieExpires.getHours() + 11);
      const lastLogin = Date.now();
      setCookie(
        "auth",
        { user, token, lastLogin },
        {
          path: "/",
          expires: cookieExpires,
        }
      );
      callback(false, "");
      setScreen(Screens.UserInfo);
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

  const performRegister = async (
    email: string,
    name: string,
    password: string,
    callback: (hasError: boolean, errorMessage: string) => void
  ) => {
    type RegisterResponse = IUser;

    try {
      const response = await axios.post<RegisterResponse>(
        "http://localhost:3000/api/users",
        {
          email,
          name,
          password,
        }
      );
      if (response.status !== 201) {
        console.log("Unexpected status code:", response.status);
        callback(true, "Registration Failed.");
        return;
      }
      callback(false, "");
      const performLoginCallback = (hasError: boolean) => {
        if (hasError) {
          setScreen(Screens.Login);
        }
      };
      performLogin(email, password, performLoginCallback);
    } catch (error) {
      const response = (error as AxiosError).response;
      if (response && response.data) {
        console.log("Error performing register:", response.data);
        if (
          response.data.errors &&
          response.data.errors[0]?.message === "email must be unique"
        ) {
          callback(true, "Email has already been taken.");
        } else {
          callback(true, "Registration Failed.");
        }
      } else {
        console.log("Error performing register:", error);
        callback(true, "Registration Failed.");
      }
    }
    return;
  };

  const renderHome = () => {
    switch (screen) {
      case Screens.Login:
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
                    setScreen(Screens.Register);
                  }}
                >
                  Register here.
                </a>
              </p>
              <FormLogin performLogin={performLogin} />
            </div>
          );
        }
      case Screens.Register:
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
                  setScreen(Screens.Login);
                }}
              >
                Login here.
              </a>
            </p>
            <FormRegister performRegister={performRegister} />
          </div>
        );
      case Screens.UserInfo:
      default:
        if (state.user && state.token) {
          return (
            <div>
              <h2 className="text-2xl text-center">
                Welcome <b>{state.user.name}</b>
              </h2>
              <div
                onClick={() => {
                  history.push("/chat");
                }}
                className="cursor-pointer mt-2 p-2 bg-gray-800 rounded text-white text-center"
              >
                <p>Enter Chat</p>
              </div>
              <p className="pt-2 text-center">
                <a
                  href=""
                  className="link"
                  onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                    event.preventDefault();
                    performLogout();
                  }}
                >
                  Logout
                </a>
              </p>
            </div>
          );
        }
        setScreen(Screens.Login);
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
