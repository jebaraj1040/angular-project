import { Component, HostListener, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";
import { NgScrollbarModule } from "ngx-scrollbar";
import {
    selectBoxHide,
    selectBoxInput,
    selectBoxOption,
} from "src/app/utilities/selectBox.utilities";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import { customerPortalConstants } from "src/constants/customer-portal";
import { CommonModule } from "@angular/common";
import {
    numbersOnly,
    repeatedCharacters,
} from "src/app/directives/generic.validators";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import {
    Validators,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormControl,
} from "@angular/forms";
import { ModalService } from "src/app/services/modal.service";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-apply-loan-modal",
    standalone: true,
    templateUrl: "./apply-loan-modal.component.html",
    styleUrl: "./apply-loan-modal.component.scss",
    imports: [
        CloseModalDirective,
        ModalDirective,
        NgScrollbarModule,
        InputFocusDirective,
        SuccessModalComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentLoaderComponent,
        RouterModule,
    ],
})
export class ApplyLoanModalComponent {
    constructor(
        protected apiService: ApiService,
        public router: Router,
        public commonService: CommonService,
        public modalService: ModalService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    productList: any;
    selectedProduct: any;
    fullName: any;
    mobileNumber: any;
    emailid: any;
    pincode: any;
    loanAmount: any;
    applyLoanForm = new FormGroup({
        fullName: new FormControl("", [Validators.required]),
        emailid: new FormControl("", [
            Validators.required,
            Validators.pattern("^[a-z0-9._-]+@[a-z0-9]+\\.[a-z]{2,4}$"),
            Validators.maxLength(50),
        ]),

        mobileNumber: new FormControl("", [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^[6-9][0-9]*$"),
            numbersOnly(),
            repeatedCharacters(),
        ]),
        pincode: new FormControl("", [
            Validators.required,
            Validators.pattern("^6[0-9]{5}$"),
            Validators.maxLength(6),
            numbersOnly(),
        ]),
        product: new FormControl("", [Validators.required]),
        loanAmount: new FormControl("", [
            Validators.required,
            Validators.min(50000),
            Validators.max(5000000),
            numbersOnly(),
        ]),
        checkbox: new FormControl(false, [Validators.requiredTrue]),
    });
    @HostListener("click") onDocumentClick() {
        selectBoxHide("show");
    }
    handler__selectInput($event: any) {
        selectBoxInput($event);
    }
    handler__selectBox($event: any) {
        $event.stopImmediatePropagation();
    }
    handler__selectOption($event: any, product: any) {
        this.applyLoanForm.controls["product"].setValue(product);
        selectBoxOption($event);
        this.selectedProduct = product;
    }
    ngOnInit() {
        this.commonService.loading = false;
        this.getProductList();
        if (isPlatformBrowser(this.platformId)) {
            this.fullName = localStorage.getItem("userName");
            this.mobileNumber = localStorage.getItem("mobileNumber");
            this.applyLoanForm.controls["fullName"].setValue(this.fullName);
            this.applyLoanForm.controls["mobileNumber"].setValue(
                this.mobileNumber
            );
        }
        this.applyLoanForm?.get("fullName")?.disable();
        this.applyLoanForm?.get("mobileNumber")?.disable();
    }
    handler__successMessage() {
        if (this.applyLoanForm.invalid) {
            for (const control of Object.keys(this.applyLoanForm.controls)) {
                this.applyLoanForm.get(control)?.markAsTouched();
            }
            return;
        }
    }
    getProductList() {
        let reqData = {
            module: "Referal",
            action: "Category",
            data: {},
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                if (response.code === 200) {
                    this.productList = response.data.response;
                } else {
                }
            })
            .catch((error) => {
                this.commonService.loading = true;
                this.apiService.handleComponentError(error);
            });
    }
    applyLoanSubmit() {
        const formValues = this.applyLoanForm.getRawValue();
        if (this.applyLoanForm.invalid) {
            for (const control of Object.keys(this.applyLoanForm.controls)) {
                this.applyLoanForm.get(control)?.markAsTouched();
            }
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber");
        }

        let reqData = {
            module: "ApplyLoan",
            action: "ApplyNow",
            data: {
                requestId: "",
                Name: formValues.fullName,
                EMailID: this.applyLoanForm.value.emailid,
                MobileNo: formValues.mobileNumber,
                product: this.selectedProduct,
                loanAmount: this.applyLoanForm.value.loanAmount,
                pincode: this.applyLoanForm.value.pincode,
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
                    this.modalService.showModal("applyLoanSuccessPopup");
                    this.applyLoanForm.reset();
                    this.fullName = localStorage.getItem("userName");
                    this.mobileNumber = localStorage.getItem("mobileNumber");
                    this.applyLoanForm.controls["fullName"].setValue(
                        this.fullName
                    );
                    this.applyLoanForm.controls["mobileNumber"].setValue(
                        this.mobileNumber
                    );
                } else {
                    this.commonService.loading = true;
                    alert("Something Went Worng");
                }
            })
            .catch((error) => {
                this.commonService.loading = true;
                this.apiService.handleComponentError(error);
            });
    }
}
