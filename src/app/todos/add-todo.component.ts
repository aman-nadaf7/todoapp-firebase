// src/app/todos/add-todo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],

  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
export class AddTodoComponent {
  todoForm: FormGroup;

  constructor(
  private fb: FormBuilder,
  private todoService: TodoService,
  public router: Router   // <-- public, not private
) {
  this.todoForm = this.fb.group({
    title: [''],
    description: [''],
    status: ['pending', Validators.required],
  });
}

  onSubmit() {
    if (this.todoForm.invalid) return;

    this.todoService.createTodo(this.todoForm.value).then(() => {
      this.router.navigate(['/todos']);
    });
  }
}
