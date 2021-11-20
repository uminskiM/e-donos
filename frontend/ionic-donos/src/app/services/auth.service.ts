import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UserOptions } from '../interfaces/user-options';
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  endpoint = 'http://localhost:8000/user/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  createUser(user: UserOptions): Observable<any> {
    console.log("USER ", user)
    return this.httpClient.post<UserOptions>(this.endpoint, JSON.stringify(user), this.httpOptions)
      .pipe(
        catchError(this.handleError<UserOptions>('Error occured'))
      );
  }

  getUser(id): Observable<UserOptions[]> {
    return this.httpClient.get<UserOptions[]>(this.endpoint + '/' + id)
      .pipe(
        tap(_ => console.log(`User fetched: ${id}`)),
        catchError(this.handleError<UserOptions[]>(`Get user id=${id}`))
      );
  }

  getUsers(): Observable<UserOptions[]> {
    return this.httpClient.get<UserOptions[]>(this.endpoint)
      .pipe(
        tap(users => console.log('Users retrieved!')),
        catchError(this.handleError<UserOptions[]>('Get user', []))
      );
  }

  updateUser(id, user: UserOptions): Observable<any> {
    return this.httpClient.put(this.endpoint + '/' + id, JSON.stringify(user), this.httpOptions)
      .pipe(
        tap(_ => console.log(`User updated: ${id}`)),
        catchError(this.handleError<UserOptions[]>('Update user'))
      );
  }

  deleteUser(id): Observable<UserOptions[]> {
    return this.httpClient.delete<UserOptions[]>(this.endpoint + '/' + id, this.httpOptions)
      .pipe(
        tap(_ => console.log(`User deleted: ${id}`)),
        catchError(this.handleError<UserOptions[]>('Delete user'))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }  
  
}