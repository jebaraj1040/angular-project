import { CommonModule } from "@angular/common";
import { Component, ElementRef } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { OtpModalComponent } from "../otp-modal/otp-modal.component";
import { SuccessCardComponent } from "../success-card/success-card.component";
import { environment } from "src/environments/environment";
import { loginLogoutConstants } from "src/constants/login-logout";
import {
    FormControl,
    Validators,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
} from "@angular/forms";
import { CommonService } from "src/app/services/common.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import { ToastComponent } from "../toast/toast.component";
import {
    numbersOnly,
    repeatedCharacters,
} from "src/app/directives/generic.validators";
@Component({
    selector: "app-simple-form3",
    standalone: true,
    templateUrl: "./simple-form3.component.html",
    styleUrl: "./simple-form3.component.scss",
    imports: [
        CommonModule,
        InputFocusDirective,
        OtpModalComponent,
        SuccessCardComponent,
        FormsModule,
        ReactiveFormsModule,
        ComponentLoaderComponent,
        ToastComponent,
    ],
})
export class SimpleForm3Component {
    forgetpasswordForm: any = FormGroup;
    forgetOtpVerifyErrMsg: any;
    forgetOtpError: any;
    forget_step1: boolean = true;
    forget_step2: boolean = false;
    forget_step3: boolean = false;
    forget_step4: boolean = false;
    newPassword: string = "";
    confirmNewPassword: string = "";
    showNewPassword: boolean = false;
    showConfirmNewPassword: boolean = false;
    mobileNumber: any;
    mobileNumberErrMsg: any;
    new_password: any;
    forgetPasswordErrMsg: any;
    confirm_new_password: any;
    submittedBtnDisabled: boolean = true;
    sessionID: any;
    message: any;
    constructor(
        protected apiService: ApiService,
        private fb: FormBuilder,
        private element: ElementRef,
        public commonService: CommonService
    ) {
        this.forgetpasswordFormValidate();
    }

    ngOnInit(): void {}

    toggleNewPasswordVisibility(): void {
        this.showNewPassword = !this.showNewPassword;
    }

    toggleConfirmNewPasswordVisibility(): void {
        this.showConfirmNewPassword = !this.showConfirmNewPassword;
    }

    mobileNumberForm = new FormGroup({
        mobileNumber: new FormControl("", [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            repeatedCharacters(),
            numbersOnly(),
            Validators.pattern("^[6-9][0-9]*$"),
        ]),
    });
    forgetpasswordFormValidate(): void {
        this.forgetpasswordForm = this.fb.group(
            {
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

    verifyUser() {
        const invalidElements = this.element.nativeElement.querySelector(
            ".form__control.ng-invalid"
        );
        if (invalidElements != null) {
            invalidElements.focus();
        }
        if (this.mobileNumberForm.invalid) {
            for (const control of Object.keys(this.mobileNumberForm.controls)) {
                this.mobileNumberForm.get(control)?.markAsTouched();
            }
            return;
        }
        this.commonService.loading = true;
        let reqData = {
            module: "Auth",
            action: "CheckUserExists",
            otpType: "forgetPassword",
            data: {
                mobileNumber: this.mobileNumber,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                const data = response.data.response;
                if (data.UserFound == "Y") {
                    this.otpCall();
                    this.mobileNumber = this.mobileNumber;
                } else if (data.UserFound == "N") {
                    this.commonService.loading = false;
                    this.mobileNumberErrMsg = "User Not Found";
                    setTimeout(() => {
                        this.mobileNumberErrMsg = "";
                    }, 4000);
                } else {
                    this.commonService.loading = false;
                    this.mobileNumberErrMsg =
                        "User check failed! Please try after some time.";
                    setTimeout(() => {
                        this.mobileNumberErrMsg = "";
                    }, 4000);
                }
            })
            .catch((error) => {
                this.mobileNumberErrMsg = error?.error?.message;
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    otpCall() {
        let reqData = {
            module: "Auth",
            action: "generateOtp",
            otpType: "forgetGetOtp",
            data: {
                mobileNumber: this.mobileNumber,
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
                    this.forget_step1 = false;
                    this.forget_step2 = true;
                } else {
                    this.mobileNumberErrMsg =
                        "Error Facing While Sending OTP Please Try again Later ";
                    setTimeout(() => {
                        this.mobileNumberErrMsg = "";
                    }, 4000);
                }
            })
            .catch((error) => {
                this.mobileNumberErrMsg = error?.error?.message;
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    editMobileNumber($event: any) {
        this.mobileNumber = $event;
        this.forget_step1 = true;
        this.forget_step2 = false;
    }
    handleOtpEntered($event: any) {
        this.commonService.loading = true;
        const otp_call = $event;
        let reqData = {
            module: "Auth",
            action: "validateOtpSessionId",
            otpType: "forgetOtpVerify",
            data: {
                mobileNumber: this.mobileNumber,
                otp_code: otp_call,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + loginLogoutConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                if (response.data.response.SuccessMessage === " OTP Matching") {
                    this.sessionID = response.data.response.SesssionID;
                    this.forget_step2 = false;
                    this.forget_step3 = true;
                } else {
                    this.forgetOtpError = "Invalid OTP";
                    setTimeout(() => {
                        this.forgetOtpError = "";
                    }, 3000);
                }
            })
            .catch((error) => {
                this.forgetOtpVerifyErrMsg = error?.error?.message;
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    forgotPasswordSubmit() {
        this.commonService.loading = true;
        let reqData = {
            module: "Auth",
            action: "quickUpdateMpinPassword",
            otpType: "quickUpdateMpinPassword",
            data: {
                mobileNumber: this.mobileNumber,
                mpin: this.new_password,
                data: "P",
                session_id: this.sessionID,
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
                    response.data.response.Data ===
                    "Credential updated successfully"
                ) {
                    this.message =
                        "Your Password has been <br />Changed successfully";
                    this.forget_step3 = false;
                    this.forget_step4 = true;
                } else {
                    this.forgetPasswordErrMsg = "Something Went Wrong !";
                    setTimeout(() => {
                        this.forgetPasswordErrMsg = "";
                    }, 3000);
                }
            })
            .catch((error) => {
                this.forgetPasswordErrMsg = "Something Went Wrong !";
                setTimeout(() => {
                    this.forgetPasswordErrMsg = "";
                }, 3000);
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
}
