// store.js
import React, { createContext, useReducer } from "react";

interface IUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

type State = {
  user: IUser | null;
  token: string | null;
};

enum ActionTypes {
  LOGIN = "LOGIN",
}

type Action = {
  type: ActionTypes.LOGIN;
  loginInfo: { user: IUser; token: string };
};

const initialState = { user: null, token: null };

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: { user: null, token: null }, dispatch: () => null });

const { Provider } = AppContext;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return action.loginInfo;
    default:
      throw new Error(`TodosContext: Action not found`);
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const AppProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { AppContext, AppProvider, ActionTypes };
export type { IUser };
