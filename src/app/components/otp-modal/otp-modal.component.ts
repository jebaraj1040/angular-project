import {
    Component,
    ElementRef,
    Output,
    EventEmitter,
    Input,
} from "@angular/core";
import {
    Validators,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
} from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
import { loginLogoutConstants } from "src/constants/login-logout";
import { environment } from "src/environments/environment";
import { numbersOnly } from "src/app/directives/generic.validators";
@Component({
    selector: "app-otp-modal",
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: "./otp-modal.component.html",
    styleUrl: "./otp-modal.component.scss",
})
export class OtpModalComponent {
    @Output() otpEntered = new EventEmitter<string>();
    @Output() editNumber = new EventEmitter<string>();
    @Input() mobileNumber: any;
    @Input() otpType: any;
    @Input() forgetOtpVerifyErrMsg: any;
    @Input() forgetOtpError: any;
    getOtpType: any;
    verifyOtpForm: any = FormGroup;
    otpCode: any;
    timeLeft: number = 30;
    interval: any;
    resend: boolean = false;
    mobileNumberErrMsg: any;

    constructor(
        private fb: FormBuilder,
        protected apiService: ApiService,
        private element: ElementRef
    ) {
        this.verifyOtpFormValidate();
        this.timeLeft = 30;
        this.startTimer();
        this.resend = true;
    }

    verifyOtpFormValidate(): void {
        this.verifyOtpForm = this.fb.group({
            otpCode: [
                "",
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(6),
                    numbersOnly(),
                ],
            ],
        });
    }
    handler__resendOtp() {
        this.otpCall();
    }
    otpCall() {
        if (this.otpType == "signUpResendOtp") {
            this.getOtpType = "signUpResendOtp";
        } else {
            this.forgetOtpError = "";
            this.getOtpType = "forgetPasswordResent";
        }
        let reqData = {
            module: "Auth",
            action: "generateOtp",
            otpType: this.getOtpType,
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
                if (response.code == 200) {
                    this.timeLeft = 30;
                    this.startTimer();
                    this.resend = true;
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
                setTimeout(() => {
                    this.mobileNumberErrMsg = "";
                }, 4000);
                this.apiService.handleComponentError(error);
            });
    }
    verifyOtp() {
        const invalidElements = this.element.nativeElement.querySelector(
            ".form__control.ng-invalid"
        );
        if (invalidElements != null) {
            invalidElements.focus();
        }
        if (this.verifyOtpForm.invalid) {
            for (const control of Object.keys(this.verifyOtpForm.controls)) {
                this.verifyOtpForm.controls[control].markAsTouched();
            }
            return;
        }
        this.otpEntered.emit(this.otpCode);
    }
    editMobileNumber() {
        this.editNumber.emit(this.mobileNumber);
    }
    formatMobileNumber(mobileNumber: string): string {
        const maskedNumber =
            "*".repeat(mobileNumber.length - 3) + mobileNumber.slice(-3);
        return maskedNumber;
    }
    startTimer(): any {
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.pasuseTime();
            }
        }, 1000);
    }
    pasuseTime() {
        clearInterval(this.interval);
        this.resend = false;
    }
}
