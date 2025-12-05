// src/app/todos/todo-list.component.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);

  constructor(private todoService: TodoService) {
    this.todoService.getTodos().subscribe((items) => {
      this.todos.set(items);
    });
  }

  // Simple grouping: Today, Yesterday, Older
  groupedTodos = computed(() => {
    const all = this.todos();
    const today: Todo[] = [];
    const yesterday: Todo[] = [];
    const older: Todo[] = [];

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

    all.forEach((todo) => {
      // todo.createdAt is Firestore Timestamp (has toDate() method)
      const createdDate: Date =
        todo.createdAt?.toDate ? todo.createdAt.toDate() : new Date();
      const time = createdDate.getTime();

      if (time >= startOfToday) {
        today.push(todo);
      } else if (time >= startOfYesterday && time < startOfToday) {
        yesterday.push(todo);
      } else {
        older.push(todo);
      }
    });

    return { today, yesterday, older };
  });

  trackById(index: number, item: Todo) {
    return item.id;
  }
}
