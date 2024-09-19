import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
} from "@angular/common/http";
import { Observable, map } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (
            isPlatformBrowser(this.platformId) &&
            localStorage.getItem("isAuthenticated") !== null
        ) {
            const token = localStorage.getItem("sessionId");
            // if the token is  stored in localstorage add it to http header
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
            //clone http to the custom AuthRequest and send it to the server
            return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    if (
                        event instanceof HttpResponse &&
                        event.body &&
                        event.body.response
                    ) {
                        const responseBody = event.body;
                        if (
                            responseBody?.response[0]?.ErrorMessage ===
                            "Session Expired"
                        ) {
                            if (isPlatformBrowser(this.platformId)) {
                                localStorage.clear();
                            }
                            this.router.navigate(["/"]);
                        }
                    }
                    return event;
                })
            );
        } else {
            return next.handle(request);
        }
    }
}
