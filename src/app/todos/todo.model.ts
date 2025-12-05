// src/app/todos/todo.model.ts
export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface Todo {
  id?: string;            // Firestore document ID
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: any;         // Firestore Timestamp
  updatedAt: any;         // Firestore Timestamp
}