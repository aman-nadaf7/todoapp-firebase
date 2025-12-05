// src/app/todos/edit-todo.component.ts
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from './todo.service';
import { Subscription } from 'rxjs';
import { Todo } from './todo.model';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css'],
})
export class EditTodoComponent implements OnDestroy {
  todoForm: FormGroup;
  todoId!: string;
  sub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private todoService: TodoService,
    public router: Router
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['pending', Validators.required],
    });

    this.todoId = this.route.snapshot.paramMap.get('id') || '';

    if (this.todoId) {
      this.sub = this.todoService.getTodoById(this.todoId).subscribe((todo: Todo) => {
        if (todo) {
          this.todoForm.patchValue({
            title: todo.title,
            description: todo.description,
            status: todo.status,
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.todoForm.invalid || !this.todoId) return;

    this.todoService.updateTodo(this.todoId, this.todoForm.value).then(() => {
      this.router.navigate(['/todos']);
    });
  }

  onDelete() {
    if (!this.todoId) return;

    this.todoService.deleteTodo(this.todoId).then(() => {
      this.router.navigate(['/todos']);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
