import { TokenService } from "./token.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
    HttpEvent
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(private tokenService: TokenService, private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.tokenService.getToken();
        let r = req;
        if (token) {
            r = req.clone({
                setHeaders: {
                    Authorization: "Bearer " + token
                }
            });
        }
        return next.handle(r).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    this.tokenService.deleteToken();
                    this.router.navigate(["/login"]);
                }
                return throwError(error);
            })
        );
    }
}
