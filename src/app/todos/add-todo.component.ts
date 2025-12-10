// src/app/todos/add-todo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from './todo.service';
import { validateEventsArray } from '@angular/fire/compat/firestore';

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
  title: ['', [Validators.required, Validators.minLength(3),,Validators.pattern('^(?=.*[A-Za-z]).+$')]],
  description: ['', [Validators.maxLength(500)]],
  status: ['pending', Validators.required],
  
});

}

  onSubmit() {
  const rawTitle = this.todoForm.get('title')?.value || '';
  const trimmedTitle = rawTitle.trim();

  if (!trimmedTitle) {
    // set back trimmed value and mark error
    this.todoForm.get('title')?.setValue('');
    this.todoForm.get('title')?.markAsTouched();
    return; // do NOT create todo
  }

  this.todoForm.get('title')?.setValue(trimmedTitle);

  if (this.todoForm.invalid) {
    this.todoForm.markAllAsTouched();
    return;
  }

  // existing create call
  this.todoService.createTodo(this.todoForm.value).then(() => {
    this.router.navigate(['/todos']);
  });
}

noWhitespaceValidator(control: AbstractControl) {
  const value = (control.value || '').toString();
  return value.trim().length === 0 ? { whitespace: true } : null;
}

}
