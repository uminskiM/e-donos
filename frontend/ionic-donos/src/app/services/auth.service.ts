import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { tap, catchError, map, mapTo } from 'rxjs/operators';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UserOptions } from '../interfaces/user-options';
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  endpoint = 'http://localhost:8000';
  private _httpOptions: any; 
  public authenticated = new BehaviorSubject<boolean>(false);

  constructor(
      private httpClient: HttpClient,
      private _localStorage: LocalStorageService
    ) {
      this._httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      };
    }



  createUser(user: UserOptions): Observable<any> {
    console.log("USER ", user)
    return this.httpClient.post<UserOptions>(`${this.endpoint}/user/`, JSON.stringify(user), this._httpOptions)
      .pipe(
        catchError(this.handleError<UserOptions>('Error occured'))
      );
  }


  public refreshToken() {
    return this.httpClient.post(
        `${this.endpoint}/login/refresh/`, 
        JSON.stringify({refresh: this.getRefreshToken()}), 
        this._httpOptions
    ).pipe(
        tap(data => {
            this._updateTokens(
                (data as any).refresh,
                (data as any).access
            );
        }),
        mapTo(true),
        catchError(error => {
            console.log(`Refresh error: ${JSON.stringify(error.error)}.`)
            this._removeTokens();
            return observableOf(false);
        })
    );
  }
  

  private _updateTokens(refreshToken: string, accessToken: string) {
    this._localStorage.set('accessToken', accessToken);
    this._localStorage.set('refreshToken', refreshToken);
  }


  private _removeTokens() {
    this._localStorage.remove('accessToken');
    this._localStorage.remove('refreshToken');
  }


  postLogin(user: any): Observable<any> {
    return this.httpClient.post<any>(`${this.endpoint}/login/`, JSON.stringify(user), this._httpOptions)
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
    return this.httpClient.get<UserOptions[]>(`${this.endpoint}/user/${id}`)
      .pipe(
        tap(_ => console.log(`User fetched: ${id}`)),
        catchError(this.handleError<UserOptions[]>(`Get user id=${id}`))
      );
  }


  public getJwtToken(): string|null {
      return this._localStorage.get('accessToken');
  }


  public getRefreshToken(): string|null {
    return this._localStorage.get('refreshToken');
  }


  getUsers(): Observable<UserOptions[]> {
    return this.httpClient.get<UserOptions[]>(`${this.endpoint}/user/`,)
      .pipe(
        tap(users => console.log('Users retrieved!')),
        catchError(this.handleError<UserOptions[]>('Get user', []))
      );
  }

  updateUser(id, user: UserOptions): Observable<any> {
    return this.httpClient.put(`${this.endpoint}/user/${id}`, JSON.stringify(user), this._httpOptions)
      .pipe(
        tap(_ => console.log(`User updated: ${id}`)),
        catchError(this.handleError<UserOptions[]>('Update user'))
      );
  }

  deleteUser(id): Observable<any> {
    return this.httpClient.delete(`${this.endpoint}/user/${id}`, this._httpOptions)
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