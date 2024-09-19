import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { CardInfoComponent } from "../../components/card-info/card-info.component";
import { SimpleFormComponent } from "../../components/simple-form/simple-form.component";
import { SimpleForm2Component } from "../../components/simple-form2/simple-form2.component";
import { OtpModalComponent } from "../../components/otp-modal/otp-modal.component";
import { SuccessCardComponent } from "../../components/success-card/success-card.component";
import { SimpleForm3Component } from "../../components/simple-form3/simple-form3.component";
import { QuickLinksComponent } from "src/app/components/quick-links/quick-links.component";
import { SimpleCardComponent } from "src/app/components/simple-card/simple-card.component";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector: "app-login",
    standalone: true,
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
    imports: [
        CardInfoComponent,
        SimpleFormComponent,
        SimpleForm2Component,
        OtpModalComponent,
        SimpleForm3Component,
        QuickLinksComponent,
        SuccessCardComponent,
        SimpleForm3Component,
        SimpleCardComponent,
    ],
})
export class LoginComponent {
    currentUrl: any;
    previousUrl: any;
    isAuthenticated: any;
    sessionId: any;
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router
    ) {}
    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.currentUrl = localStorage.getItem("currentUrl");
            this.previousUrl = localStorage.getItem("previousUrl");
            this.isAuthenticated = localStorage.getItem("isAuthenticated");
            this.sessionId = localStorage.getItem("sessionId");
        }
        this.checkUserAuth();
    }
    checkUserAuth() {
        if (this.isAuthenticated && this.sessionId) {
            if (this.currentUrl == "/") {
                this.currentUrl = this.previousUrl;
            }
            this.router.navigateByUrl(this.currentUrl);
        }
    }
}
