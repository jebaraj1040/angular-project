import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import { loginLogoutConstants } from "src/constants/login-logout";
import { OtpModalComponent } from "../otp-modal/otp-modal.component";
import { SuccessCardComponent } from "../success-card/success-card.component";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
    FormBuilder,
} from "@angular/forms";
import { CommonService } from "src/app/services/common.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import {
    alphaWithSpace,
    numbersOnly,
    repeatedCharacters,
} from "src/app/directives/generic.validators";

@Component({
    selector: "app-simple-form2",
    standalone: true,
    templateUrl: "./simple-form2.component.html",
    styleUrl: "./simple-form2.component.scss",
    imports: [
        CommonModule,
        InputFocusDirective,
        OtpModalComponent,
        SuccessCardComponent,
        FormsModule,
        ReactiveFormsModule,
        ComponentLoaderComponent,
    ],
})
export class SimpleForm2Component {
    otpType = "signUpResendOtp";
    registerForm = new FormGroup({
        user_name: new FormControl("", [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern("^\\s*[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*\\s*$"),
            alphaWithSpace(),
        ]),
        mobileNumber: new FormControl("", [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^[6-9][0-9]*$"),
            numbersOnly(),
            repeatedCharacters(),
        ]),
    });

    submittedBtnDisabled: boolean = true;
    passwordForm: any = FormGroup;
    mobileNumber: any;
    userName: any;
    enterPassword: any;
    confirmPassword: any;
    sessionId: any;
    mobileNumberErrMsg: any;
    passwordMissmatch: boolean = false;
    registerStep1: boolean = true;
    registerStep2: boolean = false;
    registerStep3: boolean = false;
    registerStep4: boolean = false;
    showEnterPassword: boolean = false;
    showReEnterPassword: boolean = false;
    errorMessage: any;
    enter_password: any;
    confirm_password: any;
    message: any;
    username: any;
    constructor(
        protected apiService: ApiService,
        public commonService: CommonService,
        private fb: FormBuilder
    ) {
        this.forgetpasswordFormValidate();
    }
    forgetpasswordFormValidate(): void {
        this.passwordForm = this.fb.group(
            {
                enter_password: [
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
                confirm_password: ["", [Validators.required]],
            },
            {
                validator: this.ConfirmedValidator(
                    "enter_password",
                    "confirm_password"
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
    toggleEnterPasswordVisibility(): void {
        this.showEnterPassword = !this.showEnterPassword;
    }

    toggleReEnterPasswordVisibility(): void {
        this.showReEnterPassword = !this.showReEnterPassword;
    }
    editMobileNumber($event: any) {
        this.mobileNumber = $event;
        this.registerStep1 = true;
        this.registerStep2 = false;
    }
    verifyUser() {
        if (this.registerForm.invalid) {
            for (const control of Object.keys(this.registerForm.controls)) {
                this.registerForm.get(control)?.markAsTouched();
            }
            return;
        }
        this.commonService.loading = true;
        let reqData = {
            module: "Auth",
            action: "CheckUserExists",
            otpType: "signinCheckUserLogin",
            data: {
                mobileNumber: this.registerForm.value.mobileNumber,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                const data = response.data.response;
                if (response.code == 429) {
                    this.mobileNumberErrMsg = response.message;
                    setTimeout(() => {
                        this.mobileNumberErrMsg = "";
                    }, 4000);
                } else {
                    if (data.UserFound == "Y") {
                        this.commonService.loading = false;
                        this.mobileNumberErrMsg =
                            "Your Number Already Exists. Please Login ";
                        setTimeout(() => {
                            this.mobileNumberErrMsg = "";
                        }, 4000);
                    } else if (data.UserFound == "N") {
                        this.commonService.loading = false;
                        this.submitData();
                    } else {
                        this.commonService.loading = false;
                        this.mobileNumberErrMsg =
                            "User check failed! Please try after some time.";
                        setTimeout(() => {
                            this.mobileNumberErrMsg = "";
                        }, 4000);
                    }
                }
            })
            .catch((error) => {
                this.errorMessage = error?.error?.message;
                setTimeout(() => {
                    this.errorMessage = "";
                }, 4000);
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }

    submitData(): void {
        if (this.registerForm.invalid) {
            for (const control of Object.keys(this.registerForm.controls)) {
                this.registerForm.get(control)?.markAsTouched();
            }
            return;
        }
        this.commonService.loading = true;
        let reqData = {
            module: "Auth",
            action: "InitiateSignUp",
            otpType: "InitiateSignUp",
            data: {
                mobileNumber: this.registerForm.value.mobileNumber,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;

                if (response.code == 200) {
                    this.registerStep1 = false;
                    this.registerStep2 = true;
                    this.errorMessage = "";
                } else {
                    this.errorMessage = response.data.Data;
                    setTimeout(() => {
                        this.errorMessage = "";
                    }, 4000);
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.errorMessage = error?.error?.message;
                setTimeout(() => {
                    this.errorMessage = "";
                }, 4000);
                this.apiService.handleComponentError(error);
            });
    }

    handleOtpEntered(event: any): void {
        this.commonService.loading = true;
        this.username = (this.registerForm.value.user_name || "").trim();
        let reqData = {
            module: "Auth",
            action: "completeSignUp",
            otpType: "completeSignUp",
            data: {
                mobileNumber: this.registerForm.value.mobileNumber,
                otp_code: event,
                first_name: this.username,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                if (response.code == 200) {
                    this.registerStep2 = false;
                    this.registerStep3 = true;
                    this.sessionId = response.data.SessionID;
                } else {
                    this.errorMessage = "Invalid OTP";
                    setTimeout(() => {
                        this.errorMessage = "";
                    }, 4000);
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.errorMessage = error?.error?.message;
                setTimeout(() => {
                    this.errorMessage = "";
                }, 4000);
                this.apiService.handleComponentError(error);
            });
    }

    regiterData(): void {
        if (this.passwordForm.invalid) {
            for (const control of Object.keys(this.passwordForm.controls)) {
                this.passwordForm.get(control)?.markAsTouched();
            }
            return;
        }

        this.commonService.loading = true;
        let reqData = {
            module: "Auth",
            action: "quickUpdateMpinPassword",
            otpType: "quickUpdateMpinPassword",
            data: {
                mobileNumber: this.registerForm.value.mobileNumber,
                mpin: this.passwordForm.value.enter_password,
                session_id: this.sessionId,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                if (response.code == 200) {
                    this.message =
                        "Your account has been <br />Created successfully";
                    this.registerStep3 = false;
                    this.registerStep4 = true;
                    this.sessionId = response.data.SessionID;
                } else {
                    this.errorMessage = response.message;
                    setTimeout(() => {
                        this.errorMessage = "";
                    }, 4000);
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.errorMessage = error?.error?.message;
                setTimeout(() => {
                    this.errorMessage = "";
                }, 4000);
                this.apiService.handleComponentError(error);
            });
    }
}
