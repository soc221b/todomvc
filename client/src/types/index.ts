import { StoreNode } from "solid-js/store";

export interface Todo extends StoreNode {
  id: number;
  title: string;
  completed: boolean;
}

export type Filter = "all" | "active" | "completed";
