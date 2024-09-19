import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router, NavigationStart } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err) => {
                if (err.status === 401) {
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.clear();

                        this.router.events.subscribe((event) => {
                            if (event instanceof NavigationStart) {
                                localStorage.setItem(
                                    "currentUrl",
                                    this.router.url
                                );
                            }
                        });
                        this.router.navigate(["/"]);
                    }
                }
                const error = err;
                return throwError(error);
            })
        );
    }
}
