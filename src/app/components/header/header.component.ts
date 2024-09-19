import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
@Component({
    selector: "app-header",
    standalone: true,
    imports: [CloseModalDirective, ModalDirective],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent {
    constructor(
        public router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    logoutButton() {
        if (isPlatformBrowser(this.platformId)) {
            let isAuthenticated = localStorage.getItem("isAuthenticated");
            if (isAuthenticated && isAuthenticated === "true") {
                return true;
            }
        }
        return false;
    }
    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.clear();
        }
        this.router.navigateByUrl("/");
    }
    home() {
        if (isPlatformBrowser(this.platformId)) {
            let isAuthenticated = localStorage.getItem("isAuthenticated");
            if (isAuthenticated && isAuthenticated === "true") {
                console.log("auth");
                this.router.navigateByUrl("/loan-listing");
            }
        } else {
            this.router.navigateByUrl("/");
        }
    }
}
