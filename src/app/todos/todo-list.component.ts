// src/app/todos/todo-list.component.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
  // all todos from Firestore
  todos = signal<Todo[]>([]);

  // search text
  searchText = signal<string>('');

  constructor(
    private todoService: TodoService,
    public router: Router
  ) {
    this.todoService.getTodos().subscribe((items) => {
      this.todos.set(items);
    });
  }

  // group by date (unchanged)
  groupedTodos = computed(() => {
    const all = this.todos();
    const groups = new Map<string, Todo[]>();

    all.forEach((todo) => {
      const createdDate: Date =
        todo.createdAt?.toDate ? todo.createdAt.toDate() : new Date();

      const key = createdDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(todo);
    });

    return Array.from(groups.entries()).map(([date, todos]) => ({
      date,
      todos,
    }));
  });

  // NEW: apply search over grouped todos
  filteredGroupedTodos = computed(() => {
    const term = this.searchText().toLowerCase().trim();
    const groups = this.groupedTodos();

    if (!term) {
      return groups;
    }

    return groups
      .map((group) => ({
        date: group.date,
        todos: group.todos.filter((todo) => {
          const title = todo.title?.toLowerCase() || '';
          const desc = todo.description?.toLowerCase() || '';
          const status = todo.status?.toLowerCase() || '';
          return (
            title.includes(term) ||
            desc.includes(term) ||
            status.includes(term)
          );
        }),
      }))
      .filter((group) => group.todos.length > 0);
  });

  // called from (input)
  onSearchChange(value: string) {
    this.searchText.set(value);
  }

  trackById(index: number, item: Todo) {
    return item.id;
  }

  toggleCompleted(todo: Todo, checked: boolean) {
    const newStatus = checked ? 'completed' : 'pending';
    if (!todo.id || todo.status === newStatus) {
      return;
    }
    this.todoService.updateTodo(todo.id, { status: newStatus });
  }

  onDeleteTodo(todo: Todo, event: MouseEvent) {
    event.stopPropagation();
    if (!todo.id) return;

    const confirmDelete = confirm(`Delete "${todo.title}"?`);
    if (!confirmDelete) return;

    this.todoService.deleteTodo(todo.id);
  }
}
