import React, { useEffect, useReducer, useState } from "react";
import { Typography, Input, Button } from "antd";

export default function NavBarApp() {
  const { Title } = Typography;

  const storedTasks = localStorage.getItem("tasks");

  const initialState = {
    newTask: "",
    tasks: storedTasks ? JSON.parse(storedTasks) : [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_TASKS":
        return {
          ...state,
          tasks: action.payload,
        };
      case "SET_NEW_TASK":
        return {
          ...state,
          newTask: action.payload,
        };
      case "ADD_TASK":
        return {
          ...state,
          tasks: [...state.tasks, action.payload],
        };
      case "EDIT_TASK":
        return {
          ...state,
          tasks: state.tasks.map((task, index) =>
            index === action.payload.index ? action.payload.task : task
          ),
        };
      case "DELETE_TASK":
        return {
          ...state,
          tasks: state.tasks.filter((_, index) => index !== action.payload),
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      dispatch({ type: "SET_TASKS", payload: JSON.parse(storedTasks) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const handleAddTask = () => {
    if (state.newTask !== "") {
      if (editingTask !== -1) {
        dispatch({
          type: "EDIT_TASK",
          payload: { index: editingTask, task: state.newTask },
        });
        setEditingTask(-1);
      } else {
        dispatch({ type: "ADD_TASK", payload: state.newTask });
      }
      dispatch({ type: "SET_NEW_TASK", payload: "" });
    }
  };

  const handleDeleteTask = (index) => {
    dispatch({ type: "DELETE_TASK", payload: index });
  };

  const [editingTask, setEditingTask] = useState(-1);
  const handleEditTask = (index) => {
    setEditingTask(index);
    dispatch({ type: "SET_NEW_TASK", payload: state.tasks[index] });
  };

  const handleSaveTask = () => {
    if (editingTask !== -1) {
      dispatch({
        type: "EDIT_TASK",
        payload: { index: editingTask, task: state.newTask },
      });
      setEditingTask(-1);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    }
  };

  return (
    <div>
      <Title style={{ textAlign: "center" }}>To Do App</Title>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Input
          placeholder="New Task..."
          style={{ width: "300px", marginBottom: "30px" }}
          value={state.newTask}
          onChange={(e) =>
            dispatch({ type: "SET_NEW_TASK", payload: e.target.value })
          }
        />
        <Button
          type="primary"
          shape="circle"
          style={{ marginLeft: "500px", marginBottom: "50px" }}
          onClick={handleAddTask}
        >
          +
        </Button>

        <div>
          {state.tasks.map((task, index) => (
            <div key={index}>
              {index === editingTask ? (
                <Input
                  style={{
                    width: "300px",
                    marginBottom: "30px",
                    marginRight: "30px",
                  }}
                  value={state.newTask}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_NEW_TASK",
                      payload: e.target.value,
                    })
                  }
                />
              ) : (
                <Input
                  style={{
                    width: "300px",
                    marginBottom: "30px",
                    marginRight: "30px",
                  }}
                  value={task}
                  readOnly
                />
              )}

              <Button danger onClick={() => handleDeleteTask(index)}>
                Delete a task
              </Button>

              {index === editingTask ? (
                <Button style={{ marginLeft: "30px" }} onClick={handleSaveTask}>
                  Save
                </Button>
              ) : (
                <Button
                  style={{ marginLeft: "30px" }}
                  onClick={() => handleEditTask(index)}
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
