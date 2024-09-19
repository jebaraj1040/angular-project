import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
    NavigationStart,
    NavigationEnd,
} from "@angular/router";
import { Observable } from "rxjs";
import { ApiService } from "../services/api.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    currentUrl: any;
    redirectUrl: any;
    constructor(
        private router: Router,
        public apiService: ApiService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const isAuthenticated = this.getAuthenticationStatus();
        const sessionId = this.getSessionId();

        if (this.isAuthenticatedAndSessionValid(isAuthenticated, sessionId)) {
            this.handleAuthenticatedUser();
            return true;
        } else {
            this.handleUnauthenticatedUser();
            return false;
        }
    }

    private getAuthenticationStatus(): string | null {
        return isPlatformBrowser(this.platformId)
            ? localStorage.getItem("isAuthenticated")
            : null;
    }

    private getSessionId(): string | null {
        return isPlatformBrowser(this.platformId)
            ? localStorage.getItem("sessionId")
            : null;
    }

    private isAuthenticatedAndSessionValid(
        isAuthenticated: string | null,
        sessionId: string | null
    ): boolean {
        return isAuthenticated !== null && sessionId !== null;
    }

    private handleAuthenticatedUser(): void {
        this.router.events.subscribe((event) => {
            if (isPlatformBrowser(this.platformId)) {
                if (event instanceof NavigationStart) {
                    localStorage.setItem("previousUrl", this.router.url);
                } else if (event instanceof NavigationEnd) {
                    this.handleNavigationEnd();
                }
            }
        });
    }

    private handleNavigationEnd(): void {
        localStorage.setItem("currentUrl", this.router.url);
    }

    private handleUnauthenticatedUser(): void {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    }
}
