import { Show, For, createSignal, onMount } from "solid-js";
import "../../assets/css/index.css";
import { useTodos } from "./useTodos";
import { useNewTodo } from "./useNewTodo";
import { useEditTodo } from "./useEditTodo";
import { useFilterState } from "./useFilterState";
import { useFilteredTodos } from "./useFilteredTodos";
import { useToggleTodo } from "./useToggleTodo";
import { useDeleteTodo } from "./useDeleteTodo";
import { setFocus } from "../../directives/setFocus";

import type { Component } from "solid-js";
import type { Filter, Todo } from "../../types";

const renderTodos: Component = () => {
  setFocus;

  const { todos, getTodos } = useTodos();
  onMount(getTodos);
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

  const [isComposing, setIsComposing] = createSignal(false);
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const renderNewTodo = (
    <input
      class="new-todo"
      value={newTodoTitle()}
      onInput={(e) => {
        handleInputNewTodo((e.target as HTMLInputElement).value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && isComposing() === false) {
          handleSubmitNewTodo();
        }
      }}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      placeholder="What needs to be done?"
      autofocus
    />
  );

  const renderTodo = (todo: Todo) => (
    <>
      <li
        class={`${todo.completed ? "completed" : ""} ${
          isTodoEditing(todo) ? "editing" : ""
        }`}
      >
        <div class="view">
          <input
            class="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo)}
          />
          <label onDblClick={() => handleEditTodo(todo)}>{todo.title}</label>
          <button
            class="destroy"
            onClick={() => handleDeleteTodo(todo)}
          ></button>
        </div>
        <Show when={isTodoEditing(todo)}>
          <input
            class="edit"
            value={editingTodo()!.title}
            onInput={(e) => {
              handleChangeEditingTodoTitle(
                (e.target as HTMLInputElement).value
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isComposing() === false) {
                handleDoneEditingTodo();
              } else if (e.key === "Escape") {
                handleCancelEditingTodo();
              }
            }}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onFocusOut={handleCancelEditingTodo}
            use:setFocus
          />
        </Show>
      </li>
    </>
  );

  function renderFilter({ label, value }: { label: string; value: Filter }) {
    return (
      <li>
        <a
          href={`/#${value}`}
          class={filterState() === value ? "selected" : ""}
        >
          {label}
        </a>
      </li>
    );
  }

  return (
    <section class="todo-app">
      <header class="header">
        <h1>todos</h1>
        {renderNewTodo}
      </header>

      <section class="main">
        <input
          class="toggle-all"
          id="toggle-all"
          type="checkbox"
          checked={areTodosCompleted()}
        />
        <label onClick={toggleTodos} for="toggle-all"></label>
        <ul class="todo-list">
          <For each={filteredTodos()}>{renderTodo}</For>
        </ul>
      </section>

      <footer class="footer">
        <span class="todo-count">
          <strong>{activeTodoCount()}</strong>
          <span>&nbsp; {activeSuffixText()}</span>
        </span>
        <ul class="filters">
          <For each={filters}>{renderFilter}</For>
        </ul>
        <button class="clear-completed" onClick={handleDeleteCompletedTodos}>
          Clear completed
        </button>
      </footer>
    </section>
  );
};

export default renderTodos;
