import { isPlatformBrowser } from "@angular/common";
import { Component, PLATFORM_ID, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ApiService } from "src/app/services/api.service";
import { ModalDirective } from "src/app/directives/modal.open.directive";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { customerPortalConstants } from "src/constants/customer-portal";
import { environment } from "src/environments/environment";
import { alphaOnly, numbersOnly } from "src/app/directives/formValidator";
import { ModalService } from "src/app/services/modal.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import { CommonService } from "src/app/services/common.service";
import { ToastComponent } from "../toast/toast.component";

import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    Validators,
} from "@angular/forms";
@Component({
    selector: "app-simple-form6",
    standalone: true,
    templateUrl: "./simple-form6.component.html",
    styleUrl: "./simple-form6.component.scss",
    imports: [
        InputFocusDirective,
        CloseModalDirective,
        ModalDirective,
        SuccessModalComponent,
        FormsModule,
        ReactiveFormsModule,
        ComponentLoaderComponent,
        ToastComponent,
    ],
})
export class SimpleForm6Component {
    addressScreen: boolean = true;
    addAddressScreen: boolean = false;
    addressData: any;
    linkChanges: any;
    errorType: any;
    mobileNumber: any;
    addressError: any;
    requestId: any;
    popupMessage: any = "";
    addressForm = new FormGroup({
        address1: new FormControl("", [
            Validators.required,
            Validators.maxLength(250),
        ]),
        address2: new FormControl("", [
            Validators.required,
            Validators.maxLength(250),
        ]),
        area: new FormControl("", [
            Validators.required,
            Validators.maxLength(250),
        ]),
        city: new FormControl("", [
            Validators.required,
            Validators.maxLength(250),
            alphaOnly(),
        ]),
        state: new FormControl("", [
            Validators.required,
            Validators.maxLength(250),
            alphaOnly(),
        ]),
        pincode: new FormControl("", [
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.required,
            numbersOnly(),
        ]),
    });
    constructor(
        protected apiService: ApiService,
        public router: Router,
        public modalService: ModalService,
        public commonService: CommonService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (typeof window !== "undefined") {
            this.commonService.loading = true;
            this.getAddressDetailsView();
        }
    }

    getAddressDetailsView() {
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
                this.commonService.loading = false;
                if (response.data.statusCode === 200) {
                    this.addressData = response.data.response;
                    if (this.addressData?.ErrorMessage == "No Details Found") {
                        this.commonService.loading = false;
                    } else {
                        this.commonService.loading = false;
                    }
                } else {
                    this.commonService.loading = false;
                    this.addressError = "Something Went Wrong !";
                    setTimeout(() => {
                        this.addressError = "";
                    }, 3000);
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.addressError = "Something Went Wrong !";
                setTimeout(() => {
                    this.addressError = "";
                }, 3000);
                console.log("error");
                console.log(error);
                this.apiService.handleComponentError(error);
            });
    }
    changeAddress() {
        this.addressScreen = false;
        this.addAddressScreen = true;
    }
    backButton() {
        if (this.addAddressScreen == true) {
            this.linkChanges = "/change-mailing-address";
            this.addressScreen = true;
            this.addAddressScreen = false;
        } else {
            this.linkChanges = "/loan-listing";
        }
    }

    addAddressSubmit() {
        if (this.addressForm.invalid) {
            for (const control of Object.keys(this.addressForm.controls)) {
                this.addressForm.get(control)?.markAsTouched();
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
                requestId: "",
                mobileNumber: this.mobileNumber,
                address1: this.addressForm.value.address1,
                address2: this.addressForm.value.address2,
                landMark1: "",
                landMark2: "",
                area: this.addressForm.value.area,
                city: this.addressForm.value.city,
                state: this.addressForm.value.state,
                country: "",
                pincode: this.addressForm.value.pincode,
                taluk: "",
                newEmailId: "",
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                if (response.data.statusCode === 200) {
                    this.commonService.loading = false;
                    this.requestId =
                        response.data.response.SuccessMessage.split(
                            ":"
                        )[1].trim();
                    this.popupMessage =
                        "Request has been registered successfully";
                    this.addressScreen = true;
                    this.addAddressScreen = false;
                    this.modalService.showModal("successModalPopup");
                    this.addressForm.reset();
                } else {
                    this.commonService.loading = false;
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
}
