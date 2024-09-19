import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";
import { OtpModal2Component } from "../otp-modal2/otp-modal2.component";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import {
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormControl,
    Validators,
} from "@angular/forms";
import { customerPortalConstants } from "src/constants/customer-portal";
import { isPlatformBrowser } from "@angular/common";
import { Inject, PLATFORM_ID } from "@angular/core";
import { ModalService } from "src/app/services/modal.service";
import { loginLogoutConstants } from "src/constants/login-logout";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import { CommonService } from "src/app/services/common.service";
import { ToastComponent } from "../toast/toast.component";
@Component({
    selector: "app-simple-form7",
    standalone: true,
    templateUrl: "./simple-form7.component.html",
    styleUrl: "./simple-form7.component.scss",
    imports: [
        InputFocusDirective,
        CloseModalDirective,
        ModalDirective,
        SuccessModalComponent,
        OtpModal2Component,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OtpModal2Component,
        ComponentLoaderComponent,
        ToastComponent,
        RouterModule,
    ],
})
export class SimpleForm7Component {
    emailStep1: boolean = true;
    emailStep2: boolean = false;
    emailStep3: boolean = false;
    errorType: any;
    errorMessages: any;
    errorMessage: any;
    mailError: any;
    emailId: any;
    currentEmailAddress: any;
    mobileNumber: any;
    otpType = "changeEmailResentOtp";
    data: any;
    newEmailAddress: any;
    emailError: any;
    custName: any;
    mobileNo: any;
    address1: any;
    address2: any;
    area: any;
    city: any;
    state: any;
    country: any;
    pincode: any;
    eMailId: any;
    otp: any;
    requestId: any;
    constructor(
        protected apiService: ApiService,
        public modalService: ModalService,
        public router: Router,
        public commonService: CommonService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    updateEmailForm = new FormGroup({
        newEmailAddress: new FormControl("", [
            Validators.required,
            Validators.pattern(
                "^(?![0-9]+$)(?=.*[a-zA-Z])([a-zA-Z0-9._%+-]*[a-zA-Z][a-zA-Z0-9._%+-]*)@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
            ),
            Validators.maxLength(200),
        ]),
    });
    ngOnInit() {
        this.commonService.loading = true;
        this.getCustomerContacts();
    }
    getCustomerContacts() {
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber");
        }

        let reqData = {
            module: "MailAddress",
            action: "GetCustomerContacts",
            data: {
                mobileNumber: this.mobileNumber,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                if (response.code === 200) {
                    this.commonService.loading = false;
                    this.currentEmailAddress = response.data.response.EMailID;
                    this.custName = response.data.response.CustName;
                    this.mobileNumber = response.data.response.MobileNo;
                    this.address1 = response.data.response.Address1;
                    this.address2 = response.data.response.Address2;
                    this.area = response.data.response.Area;
                    this.city = response.data.response.City;
                    this.state = response.data.response.State;
                    this.country = response.data.response.Country;
                    this.pincode = response.data.response.Pincode;
                } else {
                    this.mailError = "Something Went Wrong !";
                    setTimeout(() => {
                        this.mailError = "";
                    }, 3000);
                    this.commonService.loading = false;
                }
            })
            .catch((error) => {
                this.mailError = "Something Went Wrong !";
                setTimeout(() => {
                    this.mailError = "";
                }, 3000);
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    changeEmailAddress() {
        this.updateEmailForm.reset();
        this.emailStep1 = false;
        this.emailStep2 = true;
    }
    updateEmailAddress() {
        if (this.updateEmailForm.invalid) {
            for (const control of Object.keys(this.updateEmailForm.controls)) {
                this.updateEmailForm.get(control)?.markAsTouched();
            }
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber");
        }
        this.commonService.loading = true;
        let reqData = {
            module: "MailAddress",
            action: "PostCommunicationUpdate",
            data: {
                mobileNumber: this.mobileNumber,
                newEmailId: this.newEmailAddress.toLowerCase(),
                address1: this.address1,
                address2: this.address2,
                area: this.area,
                city: this.city,
                state: this.state,
                country: this.country,
                pincode: this.pincode,
                requestId: "",
                taluk: "",
                landMark1: "",
                landMark2: "",
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                this.errorMessages = response.message;
                if (response.code == 200) {
                    this.updateEmailForm.reset();
                    this.commonService.loading = false;
                    this.requestId =
                        response.data.response.SuccessMessage.split(
                            ":"
                        )[1].trim();
                    this.otpCall();
                } else {
                    this.commonService.loading = false;
                    this.errorType = response.data.data.error;
                }
            });
    }
    otpCall() {
        this.commonService.loading = true;
        let reqData = {
            module: "Auth",
            action: "generateOtp",
            otpType: "changeEmailGetOtp",
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
                    this.newEmailAddress = "";
                    this.errorMessage = "";
                    this.commonService.emailUpdateOtp = true;
                    this.commonService.loading = false;
                    this.otp = response.data.otp;
                    this.emailStep2 = false;
                    this.emailStep3 = true;
                } else {
                    this.commonService.loading = false;
                    setTimeout(() => {}, 2000);
                }
            })
            .catch((error) => {
                this.errorMessage = error?.error?.message;
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    handleOtpEntered($event: any) {
        this.commonService.loading = true;
        const otp_call = $event;
        let reqData = {
            module: "Auth",
            action: "validateOTP",
            otpType: "changeEmailVerifyOtp",
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
                this.newEmailAddress = "";
                if (response.data.response.ErrorMessage != "Not Matching") {
                    this.commonService.loading = false;
                    this.commonService.emailUpdateError = false;
                    this.modalService.showModal("verifyOtpSuccessModalPopup");
                    this.emailStep1 = true;
                    this.emailStep2 = false;
                    this.emailStep3 = false;
                } else {
                    this.commonService.loading = false;
                    this.errorMessages = response.data.response.ErrorMessage;
                    this.commonService.emailUpdateError = "Invalid OTP";
                    setTimeout(() => {
                        this.commonService.emailUpdateError = "";
                    }, 3000);
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.errorMessages = error?.error?.message;
                this.commonService.emailUpdateError = error?.error?.message;
                this.apiService.handleComponentError(error);
            });
    }
}
