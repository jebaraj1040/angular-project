import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { OtpModal2Component } from "../otp-modal2/otp-modal2.component";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { isPlatformBrowser } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import { loginLogoutConstants } from "src/constants/login-logout";
import {
    Validators,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
} from "@angular/forms";
import { ModalService } from "src/app/services/modal.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import { CommonService } from "src/app/services/common.service";
@Component({
    selector: "app-simple-form8",
    standalone: true,
    templateUrl: "./simple-form8.component.html",
    styleUrl: "./simple-form8.component.scss",
    imports: [
        OtpModal2Component,
        SuccessModalComponent,
        CloseModalDirective,
        ModalDirective,
        InputFocusDirective,
        FormsModule,
        ReactiveFormsModule,
        ComponentLoaderComponent,
        RouterModule,
    ],
})
export class SimpleForm8Component {
    changePassStep1: boolean = true;
    changePassStep2: boolean = false;
    changePassStep3: boolean = false;
    showEnterPassword: boolean = false;
    showOldEnterPassword: boolean = false;
    showReEnterPassword: boolean = false;
    mobileNumber: any;
    forgetpasswordForm: any = FormGroup;
    submittedBtnDisabled: boolean = true;
    confirm_new_password: any;
    new_password: any;
    old_password: any;
    errorMessage: any;
    constructor(
        protected apiService: ApiService,
        private fb: FormBuilder,
        public router: Router,
        public modalService: ModalService,
        public commonService: CommonService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.forgetpasswordFormValidate();
    }
    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber");
        }
    }

    toggleEnterPasswordVisibility(): void {
        this.showEnterPassword = !this.showEnterPassword;
    }
    toggleOldEnterPasswordVisibility(): void {
        this.showOldEnterPassword = !this.showOldEnterPassword;
    }
    toggleReEnterPasswordVisibility(): void {
        this.showReEnterPassword = !this.showReEnterPassword;
    }
    forgetpasswordFormValidate(): void {
        this.forgetpasswordForm = this.fb.group(
            {
                old_password: [
                    "",
                    [Validators.required, Validators.maxLength(30)],
                ],
                new_password: [
                    "",
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(30),
                        Validators.pattern(
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,30}$/
                        ),
                    ],
                ],
                confirm_new_password: ["", [Validators.required]],
            },
            {
                validator: this.ConfirmedValidator(
                    "new_password",
                    "confirm_new_password"
                ),
            }
        );
    }
    ConfirmedValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors) {
                this.submittedBtnDisabled = true;
                return;
            }
            if (control.value !== matchingControl.value) {
                this.submittedBtnDisabled = true;
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                this.submittedBtnDisabled = false;
                matchingControl.setErrors(null);
            }
        };
    }
    handleOtpEntered($event: any) {
        this.commonService.loading = true;
        const otp_call = $event;
        let reqData = {
            module: "Auth",
            action: "validateOTP",
            otpType: "changePasswordVerify",
            data: {
                mobileNumber: this.mobileNumber,
                OTP: otp_call,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                if (
                    response.data.statusCode == 200 &&
                    response.data.response.SuccessMessage == "Matching"
                ) {
                    this.commonService.emailUpdateError = "";
                    this.changePassStep1 = false;
                    this.changePassStep2 = true;
                } else {
                    this.commonService.emailUpdateError = "Invalid OTP";
                    setTimeout(() => {
                        this.commonService.emailUpdateError = "";
                    }, 3000);
                }
            })
            .catch((error) => {
                this.errorMessage = error?.error?.message;
                this.apiService.handleComponentError(error);
            });
    }

    forgotPasswordSubmit() {
        this.commonService.loading = true;
        let reqData = {
            module: "Auth",
            action: "UpdateMpinNew",
            data: {
                mobileNumber: this.mobileNumber,
                Old: this.forgetpasswordForm.value.old_password,
                New: this.forgetpasswordForm.value.new_password,
                Option: "M",
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                if (
                    response.data.response.UpdateMPin_New.Data ===
                    "SUCCESS$MPIN Changed Successfully..."
                ) {
                    this.forgetpasswordForm.reset();
                    this.changePassStep1 = true;
                    this.changePassStep2 = false;
                    this.modalService.showModal("passwordSuccessModalPopup");
                } else {
                    this.forgetpasswordForm.reset();
                }
            })
            .catch((error) => {
                this.forgetpasswordForm.reset();
                this.apiService.handleComponentError(error);
            });
    }
}
