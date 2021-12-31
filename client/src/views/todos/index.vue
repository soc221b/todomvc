<template lang="pug">
section.todo-app

  header.header
    h1 todos

    input.new-todo(
      :value="newTodoTitle"
      @input="handleInputNewTodo"
      @keyup.enter="handleSubmitNewTodo"
      placeholder="What needs to be done?"
      autofocus
    )

  section.main
    input#toggle-all.toggle-all(type="checkbox" :checked="areTodosCompleted")
    label(@click="toggleTodos" for="toggle-all")

    ul.todo-list
      template(v-for="todo of filteredTodos" :key="todo.id")
        li(:class="{ completed: todo.completed, editing: isTodoEditing(todo) }")
          .view
            input.toggle(type="checkbox" :checked="todo.completed" @change="() => toggleTodo(todo)")
            label(@dblclick="() => handleEditTodo(todo)") {{ todo.title }}
            button.destroy(@click="() => handleDeleteTodo(todo)")
          input.edit(
            v-if="isTodoEditing(todo)"
            :value="editingTodo?.title"
            @input="handleChangeEditingTodoTitle"
            @keyup.enter="handleDoneEditingTodo"
            @blur="handleCancelEditingTodo"
            @keyup.escape="handleCancelEditingTodo"
            v-autofocus
          )

  footer.footer
    span.todo-count
      strong {{ activeTodoCount }}
      span &nbsp; {{ activeSuffixText }}

    ul.filters
      template(v-for="({ label, value }) of filters" :key="value")
        li
          a(:href="`/#${value}`" :class="{ selected: filterState === value }") {{ label }}

    button.clear-completed(@click="handleDeleteCompletedTodos") Clear completed
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import "../../assets/css/index.css";
import { useTodos } from "./useTodos";
import { useNewTodo } from "./useNewTodo";
import { useEditTodo } from "./useEditTodo";
import { useFilterState } from "./useFilterState";
import { useFilteredTodos } from "./useFilteredTodos";
import { useToggleTodo } from "./useToggleTodo";
import { useDeleteTodo } from "./useDeleteTodo";

const { todos, getTodos } = useTodos();
onMounted(getTodos);
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
</script>
