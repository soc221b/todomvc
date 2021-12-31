export interface Todo {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}

export type Filter = "all" | "active" | "completed";
