import React, { FormEvent, useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";

const Home = (): JSX.Element => {
  const { state } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!email) {
      return;
    }
    if (!password) {
      return;
    }
    alert("Login\nEmail: " + email);
  };

  const renderLoginForm = () => {
    return (
      <div className="flex justify-center">
        <form
          onSubmit={handleLoginFormSubmit}
          className="flex flex-col items-center pt-4 space-y-2 w-2/4"
        >
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <input
            type="submit"
            value="Submit"
            className="p-2 rounded bg-gray-800 text-white"
          />
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
