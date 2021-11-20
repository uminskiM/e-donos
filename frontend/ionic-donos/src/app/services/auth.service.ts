import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UserOptions } from '../interfaces/user-options';
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  endpoint = 'http://localhost:8000/user/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
     'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM3Mzc1MzcxLCJqdGkiOiJhN2QyNzU2OGFhYWY0ZGVhYjMyOTE2MjRkOTI1ODM4ZiIsInVzZXJfaWQiOjN9.WMS1XNrXe078TQov0jGF8SRFdpsVvTK1t3zcU7eM4RM'
    })
  };

  constructor(private httpClient: HttpClient) { }

  createUser(user: UserOptions): Observable<any> {
    console.log("USER ", user)
    return this.httpClient.post<UserOptions>(this.endpoint, JSON.stringify(user), this.httpOptions)
      .pipe(
        catchError(this.handleError<UserOptions>('Error occured'))
      );
  }

  postLogin(user: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8000/login/', JSON.stringify(user), this.httpOptions)
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
      return throwError(error);
    };
  }  
  
}