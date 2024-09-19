import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import {
    Validators,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
} from "@angular/forms";
import { loginLogoutConstants } from "src/constants/login-logout";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { numbersOnly } from "src/app/directives/generic.validators";

@Component({
    selector: "app-otp-modal2",
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: "./otp-modal2.component.html",
    styleUrl: "./otp-modal2.component.scss",
})
export class OtpModal2Component {
    @Output() otpEntered = new EventEmitter<string>();
    @Input() mobileNumber: any;
    @Input() otpType: any;
    @Input() errorMessage: any;
    getOtpType: any;
    verifyOtpForm: any = FormGroup;
    timeLeft: number = 30;
    resentOtp: any;
    interval: any;
    resend: boolean = false;
    otpCode: any;

    constructor(
        private fb: FormBuilder,
        private element: ElementRef,
        protected apiService: ApiService,
        public commonService: CommonService
    ) {
        this.verifyOtpFormValidate();
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
    ngOnInit(): void {
        if (this.commonService.emailUpdateOtp) {
            this.verifyOtpForm.controls["otpCode"].enable();
            this.timeLeft = 30;
            this.startTimer();
            this.resend = true;
            this.resentOtp = "Resend OTP";
            this.commonService.emailUpdateOtp = false;
        } else {
            this.verifyOtpForm.controls["otpCode"].disable();
            this.resentOtp = "Send OTP";
        }
    }
    handler__resendOtp() {
        this.otpCall();
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
        this.resentOtp = "Resend OTP";
    }
    otpCall() {
        if (this.otpType === "changeEmailResentOtp") {
            this.getOtpType = "changeEmailResent";
        } else {
            this.getOtpType = "changePassword";
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
                    this.verifyOtpForm.controls["otpCode"].enable();
                    this.timeLeft = 30;
                    this.startTimer();
                    this.resend = true;
                } else {
                }
            })
            .catch((error) => {
                this.errorMessage = error?.error?.message;
                this.apiService.handleComponentError(error);
            });
    }
}
