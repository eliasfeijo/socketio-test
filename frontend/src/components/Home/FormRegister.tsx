import React, { FormEvent, useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { validateEmail } from "../../utils/Validations";

interface Params {
  performRegister: (
    email: string,
    name: string,
    password: string,
    callback: (hasError: boolean, errorMessage: string) => void
  ) => void;
}

const FormRegister = ({ performRegister }: Params): JSX.Element => {
  const [email, setEmail] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [nameHasError, setNameHasError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordConfirmationHasError, setPasswordConfirmationHasError] =
    useState(false);
  const [
    passwordConfirmationErrorMessage,
    setPasswordConfirmationErrorMessage,
  ] = useState("");

  const [isLoadingFormSubmit, setIsLoadingFormSubmit] = useState(false);

  const [registerHasError, setRegisterHasError] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");

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
    if (name.length < 3) {
      setNameHasError(true);
      setNameErrorMessage("Invalid Name.");
      validationPassed = false;
    } else {
      setNameHasError(false);
      setNameErrorMessage("");
    }
    if (password.length < 3) {
      setPasswordHasError(true);
      setPasswordErrorMessage("Invalid Password.");
      validationPassed = false;
    } else {
      setPasswordHasError(false);
      setPasswordErrorMessage("");
    }
    if (passwordConfirmation !== password) {
      setPasswordConfirmationHasError(true);
      setPasswordConfirmationErrorMessage(
        "Password confirmation doesn't match."
      );
      validationPassed = false;
    } else {
      setPasswordConfirmationHasError(false);
      setPasswordConfirmationErrorMessage("");
    }

    if (!validationPassed) {
      return;
    }

    setIsLoadingFormSubmit(true);

    return;
  };

  useEffect(() => {
    const performRegisterCallback = (
      hasError: boolean,
      errorMessage: string
    ) => {
      if (isMounted.current) {
        setRegisterHasError(hasError);
        setRegisterErrorMessage(errorMessage);
        setIsLoadingFormSubmit(false);
      }
    };
    if (isLoadingFormSubmit) {
      performRegister(email, name, password, performRegisterCallback);
    }
  }, [email, isLoadingFormSubmit, name, password, performRegister]);

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
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(event) => {
              setName(event.target.value);
            }}
            className={nameHasError ? "border-red-500" : ""}
          />
          {nameHasError && (
            <p className="text-sm text-red-500 pb-2">{nameErrorMessage}</p>
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
        <div>
          <input
            type="password"
            placeholder="Password Confirmation"
            value={passwordConfirmation}
            required
            onChange={(event) => {
              setPasswordConfirmation(event.target.value);
            }}
            className={passwordConfirmationHasError ? "border-red-500" : ""}
          />
          {passwordConfirmationHasError && (
            <p className="text-sm text-red-500 pb-2">
              {passwordConfirmationErrorMessage}
            </p>
          )}
        </div>
        {registerHasError ? (
          <div className="my-2 w-56">
            <p className="text-red-500 text-center">{registerErrorMessage}</p>
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

export default FormRegister;
