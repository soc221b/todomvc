import {  useEffect, useState } from "react";
import "../../assets/css/index.css";
import { useTodos } from "./useTodos";
import { useNewTodo } from "./useNewTodo";
import { useEditTodo } from "./useEditTodo";
import { useFilterState } from "./useFilterState";
import { useFilteredTodos } from "./useFilteredTodos";
import { useToggleTodo } from "./useToggleTodo";
import { useDeleteTodo } from "./useDeleteTodo";

import type { FunctionComponent } from "react";
import type { Filter, Todo } from "../../types";

const renderTodos: FunctionComponent = () => {
  const { todos, getTodos } = useTodos();
  useEffect(() => {
    getTodos()
  }, []);
  const withRefresh = <Fn extends (...args: any) => Promise<any>>(fn: Fn) =>
    (async (...args: any) => {
      await fn(...args);
      await getTodos();
    }) as Fn;

  const { filterState, filters } = useFilterState();

  const {
    filteredTodos,
    activeTodoCount,
    activeSuffixText,
    completedTodos,
    areTodosCompleted,
  } = useFilteredTodos({ todos, filterState });

  const { toggleTodo: _toggleTodo, toggleTodos: _toggleTodos } = useToggleTodo({
    filteredTodos,
  });
  const toggleTodo = withRefresh(_toggleTodo);
  const toggleTodos = withRefresh(_toggleTodos);

  const {
    handleDeleteTodo: _handleDeleteTodo,
    handleDeleteCompletedTodos: _handleDeleteCompletedTodos,
  } = useDeleteTodo({
    completedTodos,
  });
  const handleDeleteTodo = withRefresh(_handleDeleteTodo);
  const handleDeleteCompletedTodos = withRefresh(_handleDeleteCompletedTodos);

  const {
    newTodoTitle,
    handleInputNewTodo,
    handleSubmitNewTodo: _handleSubmitNewTodo,
  } = useNewTodo();
  const handleSubmitNewTodo = withRefresh(_handleSubmitNewTodo);

  const {
    editingTodo,
    isTodoEditing,
    handleEditTodo,
    handleChangeEditingTodoTitle,
    handleDoneEditingTodo: _handleDoneEditTodo,
    handleCancelEditingTodo,
  } = useEditTodo();
  const handleDoneEditingTodo = withRefresh(_handleDoneEditTodo);

  const [isComposing, setIsComposing] = useState(false);
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const renderNewTodo = (
    <input
      className="new-todo"
      value={newTodoTitle}
      onInput={(e) => {
        handleInputNewTodo((e.target as HTMLInputElement).value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && isComposing === false) {
          handleSubmitNewTodo();
        }
      }}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      placeholder="What needs to be done?"
      autoFocus
    />
  );

  const renderTodo = (todo: Todo) => (
      <li
        key={todo.id}
        className={`${todo.completed ? "completed" : ""} ${
          isTodoEditing(todo) ? "editing" : ""
        }`}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo)}
          />
          <label onDoubleClick={() => handleEditTodo(todo)}>{todo.title}</label>
          <button
            className="destroy"
            onClick={() => handleDeleteTodo(todo)}
          ></button>
        </div>
        {isTodoEditing(todo) && (
          <input
            className="edit"
            value={editingTodo!.title}
            onInput={(e) => {
              handleChangeEditingTodoTitle(
                (e.target as HTMLInputElement).value
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isComposing === false) {
                handleDoneEditingTodo();
              } else if (e.key === "Escape") {
                handleCancelEditingTodo();
              }
            }}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onBlur={handleCancelEditingTodo}
            autoFocus
          />
        )}
      </li>
  );

  function renderFilter({ label, value }: { label: string; value: Filter }) {
    return (
      <li key={value}>
        <a
          href={`/#${value}`}
          className={filterState === value ? "selected" : ""}
        >
          {label}
        </a>
      </li>
    );
  }

  return (
    <section className="todo-app">
      <header className="header">
        <h1>todos</h1>
        {renderNewTodo}
      </header>

      <section className="main">
        <input
          className="toggle-all"
          id="toggle-all"
          type="checkbox"
          defaultChecked={areTodosCompleted}
        />
        <label onClick={toggleTodos} htmlFor="toggle-all"></label>
        <ul className="todo-list">
          {
            filteredTodos.map((todo) => renderTodo(todo))
          }
        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          <strong>{activeTodoCount}</strong>
          <span>&nbsp; {activeSuffixText}</span>
        </span>
        <ul className="filters">
          {filters.map((filter) => renderFilter(filter))}
        </ul>
        <button className="clear-completed" onClick={handleDeleteCompletedTodos}>
          Clear completed
        </button>
      </footer>
    </section>
  );
};

export default renderTodos;
