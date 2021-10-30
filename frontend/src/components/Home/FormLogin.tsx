import axios, { AxiosError } from "axios";
import React, { FormEvent, useContext, useState } from "react";
import Loader from "react-loader-spinner";
import { ActionTypes, AppContext, IUser } from "../../contexts/AppContext";
import { validateEmail } from "../../utils/Validations";

const FormLogin = (): JSX.Element => {
  const { dispatch } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [isLoadingFormSubmit, setIsLoadingFormSubmit] = useState(false);

  const [loginHasError, setLoginHasError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const performLogin = async () => {
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
        setIsLoadingFormSubmit(false);
        return;
      }
      const user = response.data.user;
      const token = response.data.token;
      dispatch({
        type: ActionTypes.LOGIN,
        loginInfo: { user, token },
      });
      setLoginHasError(false);
      setLoginErrorMessage("");
    } catch (error) {
      const response = (error as AxiosError).response;
      if (response && response.data) {
        console.log("Error performing login:", response.data.message);
        setLoginHasError(true);
        setLoginErrorMessage("Invalid Email or Password.");
      } else {
        console.log("Error performing login:", error);
        setLoginHasError(true);
        setLoginErrorMessage("Login Failed.");
      }
    }
    setIsLoadingFormSubmit(false);
    return;
  };

  const handleLoginFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoadingFormSubmit) {
      return;
    }

    let validationPassed = true;

    if (email.length < 3 || !validateEmail(email)) {
      setEmailHasError(true);
      setEmailErrorMessage("Invalid Email.");
      validationPassed = false;
    } else {
      setEmailHasError(false);
      setEmailErrorMessage("");
    }
    if (password.length < 3) {
      setPasswordHasError(true);
      setPasswordErrorMessage("Invalid Password.");
      validationPassed = false;
    } else {
      setPasswordHasError(false);
      setPasswordErrorMessage("");
    }

    if (!validationPassed) {
      return;
    }

    setIsLoadingFormSubmit(true);

    performLogin();

    return;
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleLoginFormSubmit}
        className="flex flex-col items-center pt-4 space-y-2 w-2/4"
      >
        <div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            required
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            className={emailHasError ? "border-red-500" : ""}
          />
          {emailHasError && (
            <p className="text-sm text-red-500 pb-2">{emailErrorMessage}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            className={passwordHasError ? "border-red-500" : ""}
          />
          {passwordHasError && (
            <p className="text-sm text-red-500 pb-2">{passwordErrorMessage}</p>
          )}
        </div>
        {loginHasError ? (
          <div className="my-2 w-48">
            <p className="text-red-500">{loginErrorMessage}</p>
          </div>
        ) : null}
        {!isLoadingFormSubmit ? (
          <input
            type="submit"
            value="Submit"
            className="p-2 rounded bg-gray-800 text-white w-20"
          />
        ) : (
          <div className="p-2 rounded bg-gray-800 w-20 flex justify-center">
            <Loader type="Oval" color="#FFFFFF" height={20} width={20} />
          </div>
        )}
      </form>
    </div>
  );
};

export default FormLogin;
