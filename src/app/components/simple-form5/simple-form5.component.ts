import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, HostListener, Inject, PLATFORM_ID } from "@angular/core";
import { NgScrollbarModule } from "ngx-scrollbar";
import {
    selectBoxHide,
    selectBoxInput,
    selectBoxOption,
} from "src/app/utilities/selectBox.utilities";
import { ModalService } from "src/app/services/modal.service";
import { environment } from "src/environments/environment";
import { customerPortalConstants } from "src/constants/customer-portal";
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
@Component({
    selector: "app-simple-form5",
    standalone: true,
    imports: [
        CommonModule,
        NgScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentLoaderComponent,
    ],
    templateUrl: "./simple-form5.component.html",
    styleUrl: "./simple-form5.component.scss",
})
export class SimpleForm5Component {
    [key: string]: any;
    request_setp_1: boolean = false;
    request_setp_2: boolean = true;
    popupMessage: any = "";
    requestForm = new FormGroup({
        category: new FormControl(""),
        requestType: new FormControl("", [Validators.required]),
        upload_cv_0: new FormControl(""),
        upload_cv_1: new FormControl(""),
        upload_cv_2: new FormControl(""),
        // ...
    });
    customerRequestType: any;
    customerRequest: any;
    fileName: any;
    fileSize: any;
    fileData: any;
    currentTime: any;
    mobileNumber: any;
    userName: any;
    loanInfoData: any;
    loanNumber: any;
    loanName: any;
    interactionId: any;
    documentCount: number = 0;
    uploadFiles: File[] = [];
    documents: number[] = [1];
    fileNames: string[] = [];
    fileTypes: string[] = [];
    fileSizes: string[] = [];
    fileType: any;
    errorType: any;
    constructor(
        protected apiService: ApiService,
        public modalService: ModalService,
        @Inject(PLATFORM_ID) private platformId: Object,
        public route: ActivatedRoute,
        public router: Router,
        public commonService: CommonService
    ) {
        this.currentTime = this.getFormattedTime();
    }

    getFormattedTime(): string {
        const now = new Date();
        let hours: string | number = now.getHours();
        const minutes: string | number = now.getMinutes();
        let ampm: string = "AM";

        if (hours >= 12) {
            ampm = "PM";
            if (hours > 12) {
                hours -= 12;
            }
        } else if (hours === 0) {
            hours = 12;
        }
        const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}.${minutesFormatted} ${ampm}`;
    }
    @HostListener("click") onDocumentClick() {
        selectBoxHide("show");
    }
    ngOnInit(): void {
        this.requestForm.controls["category"].setValue(
            "Customer Details Update"
        );
        this.getLoanId();
        this.getLoanDueInfo();
    }

    handler__selectInput($event: any) {
        selectBoxInput($event);
    }
    handler__selectBox($event: any) {
        $event.stopImmediatePropagation();
    }
    handler__selectOption(
        $event: any,
        activeOption: any,
        formControlName: string = "",
        formControl: any = ""
    ) {
        if (formControl)
            formControl.get(formControlName)?.setValue(activeOption);
        selectBoxOption($event);
        this.customerRequestType = activeOption.id;
    }
    handler__selectOptionOther(
        $event: any,
        activeOption: any,
        formControlName: string = "",
        formControl: any = ""
    ) {
        if (formControl)
            formControl.get(formControlName)?.setValue(activeOption);
        selectBoxOption($event);
        this.customerRequest = activeOption;
    }
    items = [
        { id: "AddressChange", name: "Address Changes" },
        { id: "EmailID", name: "Email Id" },
        { id: "ContactNumber", name: "Contact Number" },
    ];
    uploadDocumentFile(event: any, index: number): void {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const fileName = file.name;
            const fileSize = file.size;
            const fileType = file.type;

            const allowedTypes = [
                "image/png",
                "image/jpg",
                "image/jpeg",
                "application/pdf",
            ];
            const maxFileSize = 5 * 1024 * 1024; // 5MB

            // Clear previous errors for the specific control
            const controlName = "upload_cv_" + index;
            const control = this.requestForm.get(controlName);

            if (control) {
                control.setErrors(null);
            }

            // Validate file type
            if (!allowedTypes.includes(fileType)) {
                if (control) {
                    control.setErrors({
                        invalidFileType: true,
                    });
                }
                event.target.value = "";
                return;
            }

            // Validate file size
            if (fileSize > maxFileSize) {
                if (control) {
                    control.setErrors({
                        fileTooLarge: true,
                    });
                }
                event.target.value = "";
                return;
            }

            if (index >= 0 && index < 3) {
                this.uploadFiles[index] = file;
                this.fileNames[index] = fileName;
                this.fileSizes[index] = fileSize;
                this.fileTypes[index] = fileType;
            }
        }
    }

    // Function to add a new document upload section (up to 3)
    addDocument(): void {
        if (this.documents.length < 3) {
            this.documentCount = this.documents.length + 1;
            this.documents.push(this.documents.length + 1);
        }
    }

    inputData: any;

    removeFile(index: number) {
        this.documentCount -= 1;
        this.fileNames.splice(index, 1);
        this.documents.splice(index, 1);
    }
    getRaiseRequest() {
        if (this.requestForm.invalid) {
            for (const control of Object.keys(this.requestForm.controls)) {
                this.requestForm.get(control)?.markAsTouched();
            }
            return;
        }
        this.commonService.loading = true;
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber") || "";
            this.userName = localStorage.getItem("userName") || "";
        }
        const dataObject: any = {
            requestType: this.customerRequestType,
            request: "customerrequest",
            mobileNumber: this.mobileNumber,
        };

        // Create the FormData object
        const formArray: FormData = new FormData();
        formArray.append("module", "RaiseARequest");
        formArray.append("action", "RaiseARequest");
        formArray.append("fileNames", JSON.stringify(this.fileNames));
        formArray.append("fileTypes", JSON.stringify(this.fileTypes));
        formArray.append("fileSizes", JSON.stringify(this.fileSizes));
        for (const key in dataObject) {
            if (dataObject.hasOwnProperty(key)) {
                formArray.append(`data[${key}]`, dataObject[key]);
            }
        }
        this.uploadFiles.forEach((file: File, index: number) => {
            if (file) {
                formArray.append(`file${index + 1}`, file, file.name);
            }
        });
        this.apiService
            .restApiCall(
                formArray,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                if (
                    response.code === 200 &&
                    response.data[0].error.length === 0
                ) {
                    this.interactionId = response.data[0].interactionId;
                    this.request_setp_1 = true;
                    this.request_setp_2 = false;
                } else if (response.data[0].error.length != 0) {
                    this.errorType = response.data[0].error;
                } else {
                    this.commonService.loading = false;
                    this.errorType = response.data.error;
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    getLoanDueInfo() {
        let reqData = {
            module: "Payments",
            action: "GetLoanDueInfo",
            data: {
                LoanNumber: this.loanNumber,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                if (response.data.statusCode === 200) {
                    this.loanInfoData = response.data.response[0];
                    this.loanName = response.data.response[0].LoanType;
                } else {
                }
            })
            .catch((error) => {
                this.apiService.handleComponentError(error);
            });
    }
    getLoanId() {
        this.route.queryParams.subscribe((params) => {
            if (params["loanId"]) {
                this.loanNumber = params["loanId"];
            }
        });
    }

    viewTicket() {
        this.commonService.transferData = "serviceRequest";
        this.router.navigateByUrl(
            "/track-my-request?loanId=" + this.loanNumber
        );
    }
}
