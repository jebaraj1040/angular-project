import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
    Component,
    Inject,
    PLATFORM_ID,
    ElementRef,
    Renderer2,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { customerPortalConstants } from "src/constants/customer-portal";
import { ModalService } from "src/app/services/modal.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-simple-form10",
    standalone: true,
    imports: [
        CommonModule,
        InputFocusDirective,
        SuccessModalComponent,
        FormsModule,
        ReactiveFormsModule,
        ComponentLoaderComponent,
        RouterModule,
    ],
    templateUrl: "./simple-form10.component.html",
    styleUrl: "./simple-form10.component.scss",
})
export class SimpleForm10Component {
    subject: string = "";
    feedback: any;
    errorType: any;
    errorMessage: any;
    userName: any;
    selectedTab: number = 1;
    mobileNumber: any;
    writeToUsForm = new FormGroup({
        subject: new FormControl("", [
            Validators.required,
            Validators.maxLength(250),
        ]),
        feedback: new FormControl("", [
            Validators.minLength(3),
            Validators.maxLength(250),
            Validators.required,
        ]),
    });
    tabLabels: any = {
        1: {
            feedback: "comment",
        },
        2: {
            feedback: "suggestion",
        },
        3: {
            feedback: "query",
        },
    };
    constructor(
        protected apiService: ApiService,
        public router: Router,
        public modalService: ModalService,
        public commonService: CommonService,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    handler__successMessage() {
        this.submitFeedback();
    }

    selectTab(index: number): void {
        this.selectedTab = index;
        this.writeToUsForm.reset();
    }

    get currentLabels() {
        return this.tabLabels[this.selectedTab] || this.tabLabels[1];
    }

    submitFeedback() {
        if (this.writeToUsForm.invalid) {
            for (const control of Object.keys(this.writeToUsForm.controls)) {
                this.writeToUsForm.get(control)?.markAsTouched();
            }
            return;
        }
        this.commonService.loading = true;
        if (isPlatformBrowser(this.platformId)) {
            this.userName = localStorage.getItem("userName");
            this.mobileNumber = localStorage.getItem("mobileNumber");
        }
        let reqData = {
            module: "WriteUs",
            action: "postComplaintDetails",
            data: {
                subject: this.writeToUsForm.value.subject,
                feedback: this.writeToUsForm.value.feedback,
                mobileNumber: this.mobileNumber,
                enquiry: "",
                subEnquiry: "",
                emailID: "",
                landLineNo: "",
                identity: "",
                customerName: this.userName,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                this.errorMessage = response.message;
                if (response.code == 200) {
                    this.removeFocusedClass();
                    this.commonService.loading = false;
                    this.modalService.showModal("feedbackSuccessModalPopup");
                    this.writeToUsForm.reset();
                } else {
                    this.commonService.loading = false;
                    this.errorType = response.data.error;
                }
            });
    }

    removeFocusedClass() {
        console.log("form group element", this.elementRef.nativeElement);

        const formGroups =
            this.elementRef.nativeElement.querySelectorAll(".form-group");
        formGroups.forEach((formGroup: any) => {
            this.renderer.removeClass(formGroup, "focused");
        });
    }
    capitalizeFirstLetter(text: string): string {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
