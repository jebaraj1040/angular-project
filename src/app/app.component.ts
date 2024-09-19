import { Component, HostListener, PLATFORM_ID, Inject } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ActivationEnd, Router, RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { selectBoxHide } from "./utilities/selectBox.utilities";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { ErrorInterceptor } from "./auth/error.interceptor";
@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        HttpClientModule,
        HeaderComponent,
        FooterComponent,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    title = "shfl-customer-portal-fe";
    showSideBarMenu: boolean = false;
    removeHeight: boolean = false;
    routeSubscription!: Subscription;

    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        this.routeSubscription = this.router.events.subscribe((event) => {
            if (event instanceof ActivationEnd) {
                if (isPlatformBrowser(this.platformId)) {
                }
                if (typeof window != "undefined") {
                    window.scrollTo(0, 0);
                }
            }
        });
    }

    @HostListener("window:keydown.tab", ["$event"])
    @HostListener("window:keydown.shift.tab", ["$event"])
    // @HostListener('document:keydown', ['$event'])
    handleTabKeyWInModel(event: any) {
        if (typeof window != "undefined") {
            if (event.keyCode === 9) {
                let focusable = document.querySelector(".modal.show");
                let elements = focusable?.querySelectorAll(
                    'input:not([disabled]),button:not([disabled]),select:not([disabled]),textarea:not([disabled]),a,[tabindex]:not([tabindex="-1"])'
                );
                if (elements && elements.length) {
                    let first = elements[0] as HTMLInputElement;
                    let last = elements[
                        elements.length - 1
                    ] as HTMLInputElement;
                    let shift = event.shiftKey;
                    if (shift) {
                        if (event.target === first) {
                            last.focus();
                            event.preventDefault();
                        }
                    } else {
                        if (event.target === last) {
                            first.focus();
                            event.preventDefault();
                        }
                    }
                }
            }
        }
    }

    @HostListener("document:keydown.tab", ["$event"]) onKeydownHandler() {
        selectBoxHide("show");
    }
}
