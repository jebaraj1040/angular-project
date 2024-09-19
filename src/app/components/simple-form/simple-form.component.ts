import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import { loginLogoutConstants } from "src/constants/login-logout";
import {
    numbersOnly,
    repeatedCharacters,
} from "src/app/directives/generic.validators";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";

@Component({
    selector: "app-simple-form",
    standalone: true,
    imports: [
        CommonModule,
        InputFocusDirective,
        FormsModule,
        ReactiveFormsModule,
        ComponentLoaderComponent,
        RouterModule,
    ],
    templateUrl: "./simple-form.component.html",
    styleUrl: "./simple-form.component.scss",
})
export class SimpleFormComponent {
    password: string = "";
    showPassword: boolean = false;
    requestId: any;
    imagePath: any;
    mobileNumber: any;
    captcha: any;
    errorType: any;
    errorMessage: any;
    loginForm = new FormGroup({
        mobile_number: new FormControl("", [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^[6-9][0-9]*$"),
            numbersOnly(),
            repeatedCharacters(),
        ]),
        password: new FormControl("", [
            Validators.minLength(3),
            Validators.maxLength(40),
            Validators.required,
        ]),
        captcha: new FormControl("", [Validators.required]),
    });

    constructor(
        protected apiService: ApiService,
        private router: Router,
        public commonService: CommonService
    ) {}

    ngOnInit(): void {
        this.genarateCaptha();
    }

    handler__successMessage() {
        this.submitLogin();
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
    genarateCaptha() {
        this.captcha = "";
        let reqData = {
            module: "Captcha",
            action: "generateCaptcha",
            data: {},
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                this.requestId = response.data.request_id;
                const contentType = "image/png";
                const blob = this.b64toBlob(response.data.captcha, contentType);
                const blobUrl = URL.createObjectURL(blob);
                this.imagePath = blobUrl;
            });
    }
    b64toBlob = (captcha: any, contentType = "", sliceSize = 512) => {
        const byteCharacters = atob(captcha);
        const byteArrays = [];
        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
    submitLogin() {
        if (this.loginForm.invalid) {
            for (const control of Object.keys(this.loginForm.controls)) {
                this.loginForm.get(control)?.markAsTouched();
            }
            return;
        }
        this.commonService.loading = true;
        let reqData = {
            module: "Auth",
            action: "authLogin",
            otpType: "authLogin",
            data: {
                request_id: this.requestId,
                verify_captcha: this.captcha,
                mobileNumber: this.loginForm.value.mobile_number,
                password: this.loginForm.value.password,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                this.errorMessage = response.message;
                setTimeout(() => {
                    this.errorMessage = "";
                }, 4000);
                if (response.code == 200) {
                    localStorage.setItem(
                        "sessionId",
                        response.data.SessionToken
                    );
                    localStorage.setItem(
                        "mobileNumber",
                        response.data.MobileNumber
                    );
                    localStorage.setItem("userName", response.data.UserName);
                    localStorage.setItem("isAuthenticated", "true");
                    this.router.navigate(["loan-listing"]);
                } else {
                    this.genarateCaptha();
                    this.errorType = response.message;
                    setTimeout(() => {
                        this.errorType = "";
                    }, 4000);
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.genarateCaptha();
                this.errorType = error?.error?.message;
                setTimeout(() => {
                    this.errorType = "";
                }, 4000);
                this.apiService.handleComponentError(error);
            });
    }
}
