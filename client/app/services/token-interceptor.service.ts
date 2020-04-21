import { CookieService } from "ngx-cookie-service";
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
export class TokenInterceptorService implements HttpInterceptor {
    constructor(private cookieService: CookieService, private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.cookieService.get("accessToken");
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
                    this.cookieService.delete("accessToken");
                    this.router.navigate(["/login"]);
                }
                return throwError(error);
            })
        );
    }
}
