// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TodoListComponent } from './todos/todo-list.component';
import { AddTodoComponent } from './todos/add-todo.component';
import { EditTodoComponent } from './todos/edit-todo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodoListComponent },
  { path: 'todos/add', component: AddTodoComponent },
  { path: 'todos/edit/:id', component: EditTodoComponent },
  { path: '**', redirectTo: 'todos' },
];
