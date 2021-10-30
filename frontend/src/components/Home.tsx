import React, { FormEvent, useContext, useState } from "react";
import Loader from "react-loader-spinner";
import { AppContext } from "../contexts/AppContext";
import { validateEmail } from "../utils/Validations";

const Home = (): JSX.Element => {
  const { state } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [isLoadingFormSubmit, setIsLoadingFormSubmit] = useState(false);

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

    return;
  };

  const renderLoginForm = () => {
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
              <p className="text-sm text-red-500 pb-2">
                {passwordErrorMessage}
              </p>
            )}
          </div>
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

  const renderHome = () => {
    if (!state.token || !state.user) {
      return (
        <div>
          <h2 className="text-2xl text-center">Login</h2>
          {renderLoginForm()}
        </div>
      );
    }
    return (
      <div>
        <p className="text-center">Welcome {state.user.name}</p>
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
