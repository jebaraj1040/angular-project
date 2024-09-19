import { isPlatformBrowser } from "@angular/common";
import {
    Component,
    HostListener,
    PLATFORM_ID,
    Inject,
    ElementRef,
    Renderer2,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { NgScrollbarModule } from "ngx-scrollbar";
import {
    selectBoxHide,
    selectBoxInput,
    selectBoxOption,
} from "src/app/utilities/selectBox.utilities";
import {
    numbersOnly,
    repeatedCharacters,
    emailValidations,
    alphaWithSpace,
} from "src/app/directives/generic.validators";
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { environment } from "src/environments/environment";
import { customerPortalConstants } from "src/constants/customer-portal";
import { ApiService } from "src/app/services/api.service";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { ModalService } from "src/app/services/modal.service";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";

@Component({
    selector: "app-simple-form11",
    standalone: true,
    templateUrl: "./simple-form11.component.html",
    styleUrl: "./simple-form11.component.scss",
    imports: [
        NgScrollbarModule,
        InputFocusDirective,
        CloseModalDirective,
        ModalDirective,
        SuccessModalComponent,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
})
export class SimpleForm11Component {
    mobileNumber: any;
    userName: any;
    productData: any;
    popupMessage: any = "";
    productForm = new FormGroup({
        personName: new FormControl("", [
            Validators.required,
            Validators.maxLength(250),
            alphaWithSpace(),
        ]),
        personMobileNumber: new FormControl("", [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^[6-9][0-9]*$"),
            numbersOnly(),
            repeatedCharacters(),
        ]),
        personEmail: new FormControl("", [
            Validators.required,
            Validators.email,
            Validators.pattern("^[a-z0-9._-]+@[a-z0-9]+\\.[a-z]{2,4}$"),
            emailValidations(),
            Validators.maxLength(250),
        ]),
        product: new FormControl("", [
            Validators.required,
            Validators.maxLength(250),
        ]),
        howDoYouKnowPers: new FormControl("", [Validators.maxLength(250)]),
        durationKnown: new FormControl("", [Validators.maxLength(250)]),
        suggestionRmrk: new FormControl("", [Validators.maxLength(250)]),
    });
    constructor(
        protected apiService: ApiService,
        public router: Router,
        public modalService: ModalService,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
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
        selectBoxOption($event);
        this.productForm.value.product = product;
    }
    ngOnInit(): void {
        if (typeof window !== "undefined") {
            this.getAddressDetailsView();
        }
    }
    getAddressDetailsView() {
        let reqData = {
            module: "Referal",
            action: "Category",
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                if (response.data.statusCode === 200) {
                    this.productData = response.data.response;
                } else {
                }
            })
            .catch((error) => {
                this.apiService.handleComponentError(error);
            });
    }
    refereSubmit() {
        if (this.productForm.invalid) {
            for (const control of Object.keys(this.productForm.controls)) {
                this.productForm.get(control)?.markAsTouched();
            }
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber");
            this.userName = localStorage.getItem("userName");
        }

        let remark = {
            EmailId: this.productForm.value.personEmail,
            HowDoYouKnowPers: this.productForm.value.howDoYouKnowPers,
            DurationKnown: this.productForm.value.durationKnown,
            SuggestionRmrk: this.productForm.value.suggestionRmrk,
        };
        let reqData = {
            module: "Referal",
            action: "postReferDetails",
            data: {
                name: this.userName,
                mobileNumber: this.mobileNumber,
                refName: this.productForm.value.personName,
                refMobileNo: this.productForm.value.personMobileNumber,
                product: this.productForm.value.product,
                remarks: JSON.stringify(remark),
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                if (response.data.statusCode === 200) {
                    this.productForm.reset();
                    this.removeFocusedClass();
                    this.modalService.showModal("successModalPopup");
                    this.popupMessage =
                        "Request has been registered successfully";
                } else {
                }
            })
            .catch((error) => {
                this.apiService.handleComponentError(error);
            });
    }
    removeFocusedClass() {
        const formGroups =
            this.elementRef.nativeElement.querySelectorAll(".form-group");
        formGroups.forEach((formGroup: any) => {
            this.renderer.removeClass(formGroup, "focused");
        });
    }
}
