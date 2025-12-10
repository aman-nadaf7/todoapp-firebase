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
originalValue!: { title: string; description: string; status: string };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private todoService: TodoService,
    public router: Router
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3),Validators.pattern('^(?=.*[A-Za-z]).+$')]],
      description: ['', [Validators.maxLength(100)]],
      status: ['pending', Validators.required],
    });

    this.todoId = this.route.snapshot.paramMap.get('id') || '';

    if (this.todoId) {
  this.sub = this.todoService
    .getTodoById(this.todoId)
    .subscribe((todo: Todo) => {
      if (todo) {
        this.originalValue = {
          title: todo.title || '',
          description: todo.description || '',
          status: todo.status || 'pending',
        };

        this.todoForm.patchValue(this.originalValue);
        this.todoForm.markAsPristine();
      }
    });
}

  }

  onSubmit() {
    if (this.todoForm.invalid || !this.todoId || !this.todoForm.dirty) {
      this.todoForm.markAllAsTouched();
      return;
    }

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

  goBackToList() {
  // if form is pristine (no user edits), just go back
  if (this.todoForm.pristine) {
    this.router.navigate(['/todos']);
    return;
  }

  const confirmLeave = confirm(
    'You have unsaved changes. Are you sure you want to go back?'
  );

  if (confirmLeave) {
    this.router.navigate(['/todos']);
  }
}



  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
