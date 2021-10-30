// store.js
import React, { createContext, useReducer } from "react";

interface ITodo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

type State = {
  todos: ITodo[];
};

enum ActionTypes {
  SET_TODOS = "SET_TODOS",
  TOGGLE_COMPLETED = "TOGGLE_COMPLETED",
  DELETE = "DELETE",
  ADD = "ADD",
}

type Action =
  | { type: ActionTypes.SET_TODOS; todos: ITodo[] }
  | { type: ActionTypes.TOGGLE_COMPLETED; todo: ITodo }
  | { type: ActionTypes.DELETE; todo: ITodo }
  | { type: ActionTypes.ADD; todo: ITodo };

const initialState = { todos: [] };

const TodosContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const { Provider } = TodosContext;

const reducer = (state: State, action: Action): State => {
  let todos: ITodo[];
  switch (action.type) {
    case ActionTypes.SET_TODOS:
      return { todos: action.todos };
    case ActionTypes.TOGGLE_COMPLETED:
      todos = state.todos.map((todo) => {
        if (todo.id === action.todo.id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return { todos };
    case ActionTypes.DELETE:
      todos = state.todos.filter((todo) => todo.id !== action.todo.id);
      return { todos };
    case ActionTypes.ADD:
      todos = [action.todo, ...state.todos];
      return { todos };
    default:
      throw new Error(`TodosContext: Action not found`);
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const TodosProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { TodosContext, TodosProvider, ActionTypes };
export type { ITodo };
