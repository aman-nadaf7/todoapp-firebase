//your Angular app talks to Firebase Firestore for todos. It encapsulates all CRUD operations and real‑time listeners, so components don’t directly touch Firestore.
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosColRef;

  constructor(private firestore: Firestore) {
    this.todosColRef = collection(this.firestore, 'todos');
  }

  getTodos(): Observable<Todo[]> {
    const q = query(this.todosColRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Todo[]>;
  }

  getTodoById(id: string): Observable<Todo> {
    const todoDocRef = doc(this.firestore, `todos/${id}`);
    return docData(todoDocRef, { idField: 'id' }) as Observable<Todo>;
  }

  createTodo(todo: { title: string; description: string; status: string }) {
    return addDoc(this.todosColRef, {
      ...todo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  updateTodo(id: string, todo: Partial<Todo>) {
    const todoDocRef = doc(this.firestore, `todos/${id}`);
    return updateDoc(todoDocRef, {
      ...todo,
      updatedAt: serverTimestamp(),
    });
  }

  deleteTodo(id: string) {
    const todoDocRef = doc(this.firestore, `todos/${id}`);
    return deleteDoc(todoDocRef);
  }
}
