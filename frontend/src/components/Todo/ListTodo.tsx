import axios from "axios";
import React, { useContext, useEffect } from "react";
import { ActionTypes, ITodo, TodosContext } from "../../contexts/TodosContext";

const ListTodo = (): JSX.Element => {
  const { state, dispatch } = useContext(TodosContext);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=5",
        {}
      );
      dispatch({ type: ActionTypes.SET_TODOS, todos: response.data });
    };
    if (state.todos.length === 0) {
      console.log("aaa");
      fetchTodos();
    }
  }, [dispatch, state.todos.length]);

  const onChangeCompleted = async (todo: ITodo) => {
    dispatch({ type: ActionTypes.TOGGLE_COMPLETED, todo });
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      {
        ...todo,
        completed: !todo.completed,
      }
    );
    if (response.status !== 200) {
      console.log("Error updating Todo:", response);
    }
  };

  const onClickRemove = async (todo: ITodo) => {
    dispatch({ type: ActionTypes.DELETE, todo });
    const response = await axios.delete(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      {}
    );
    if (response.status !== 200) {
      console.log("Error deleting Todo:", response);
    }
  };

  const todos = state.todos.map((todo) => {
    return (
      <div
        key={todo.id}
        className="w-full md:w-3/4 xl:w-2/5 flex items-center justify-between space-x-4 bg-gray-200 py-2 px-2 rounded"
      >
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onChangeCompleted(todo)}
        />
        <p
          className={
            "text-center break-all" + (todo.completed ? " line-through" : "")
          }
        >
          {todo.title}
        </p>
        <div
          className="cursor-pointer text-red-500"
          onClick={() => onClickRemove(todo)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    );
  });

  return (
    <div className="pt-4">
      <h3 className="text-xl text-center">Todos</h3>
      <div className="flex flex-col justify-center items-center pt-4 space-y-4">
        {todos}
      </div>
    </div>
  );
};

export default ListTodo;
