import React, { FormEvent, useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { validateEmail } from "../../utils/Validations";

interface Params {
  performLogin: (
    email: string,
    password: string,
    callback: (hasError: boolean, errorMessage: string) => void
  ) => void;
}

const FormLogin = ({ performLogin }: Params): JSX.Element => {
  const [email, setEmail] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [isLoadingFormSubmit, setIsLoadingFormSubmit] = useState(false);

  const [loginHasError, setLoginHasError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const isMounted = React.useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  useEffect(() => {
    const performLoginCallback = (hasError: boolean, errorMessage: string) => {
      if (isMounted.current) {
        setLoginHasError(hasError);
        setLoginErrorMessage(errorMessage);
        setIsLoadingFormSubmit(false);
      }
    };
    if (isLoadingFormSubmit) {
      performLogin(email, password, performLoginCallback);
    }
  }, [email, isLoadingFormSubmit, password, performLogin]);

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
          <div className="my-2 w-56">
            <p className="text-red-500 text-center">{loginErrorMessage}</p>
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
