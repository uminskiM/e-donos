import { AuthService } from './auth.service';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError, observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';


@Injectable({
  providedIn: 'root'
})


export class InterceptorService {

  private _refreshingInProgress: boolean;
    private _refreshTokenSubject: BehaviorSubject<any>;
    

    constructor(
            private _router: Router,
            private _authApi: AuthService
        ) { 
        this._refreshingInProgress = false;
        this._refreshTokenSubject = new BehaviorSubject<any>(null);
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        console.log(this._authApi.getJwtToken())
        
        if (
            request.url.includes('refresh') ||
            request.url.includes('logout') ||
            request.url.includes('user')
        ) {
            return next.handle(request);
        }

        if (this._authApi.getJwtToken()) {
            request = this._injectToken(
                request,
                this._authApi.getJwtToken()
            )
        }
        
        return next.handle(request).pipe(catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this._handleUnauthorized(request, next)
                } else {
                    return throwError(error);
                }
            }
        ));
    }

    
    private _handleUnauthorized(request: HttpRequest<any>, next: HttpHandler) {
        if (!this._refreshingInProgress) {
            this._refreshingInProgress = true;
            this._refreshTokenSubject.next(null);
      
            return this._authApi.refreshToken().pipe(
                switchMap((token: any) => {
                    this._refreshingInProgress = false;
                    this._refreshTokenSubject.next(this._authApi.getJwtToken());
                    return next.handle(this._injectToken(request, this._authApi.getJwtToken()));
                }),
                catchError(error => {
                    return of(undefined)
                })
            );
      
        } else {
            return this._refreshTokenSubject.pipe(
                take(1),
                switchMap(jwt => {
                        return next.handle(this._injectToken(request, jwt));
                    }
                ),
                catchError(error => {
                    return of(undefined)
                })
            );
        }
    }


    private _injectToken(request: HttpRequest<any>, token: string|null) {    
        return request.clone({
            setHeaders: {
                'Authorization': `JWT ${token}`
            }
        });
    }
}
