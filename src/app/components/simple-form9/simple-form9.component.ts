import {
    Component,
    Input,
    HostListener,
    PLATFORM_ID,
    Inject,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { NgScrollbarModule } from "ngx-scrollbar";
import { customerPortalConstants } from "src/constants/customer-portal";
import { ApiService } from "src/app/services/api.service";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { environment } from "src/environments/environment";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";
import {
    selectBoxHide,
    selectBoxInput,
    selectBoxOption,
} from "src/app/utilities/selectBox.utilities";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { ModalService } from "src/app/services/modal.service";

@Component({
    selector: "app-simple-form9",
    standalone: true,
    imports: [
        SideBarComponent,
        NgScrollbarModule,
        InputFocusDirective,
        SuccessModalComponent,
        CloseModalDirective,
        ModalDirective,
    ],
    templateUrl: "./simple-form9.component.html",
    styleUrl: "./simple-form9.component.scss",
})
export class SimpleForm9Component {
    mobileNumber: any;
    financialYear: any;
    customerEmail: any = "";
    finalYear: any = "";
    finalYearError: any = false;
    emailError: any = false;
    loadName: any;
    popupMessage: any = "";
    incomeTaxCertificate: any;
    downloadCertificateLoader: any = false;
    exportButtonDisabled: boolean = false;
    @Input() LoanNumber: any;
    assetsCDNUrl = environment.assetsCDNUrl;
    @HostListener("click") onDocumentClick() {
        selectBoxHide("show");
    }
    handler__selectInput($event: any) {
        selectBoxInput($event);
    }
    handler__selectBox($event: any) {
        $event.stopImmediatePropagation();
    }
    handler__selectOption($event: any, $year: any) {
        selectBoxOption($event);
        this.finalYear = $year;
        this.finalYearError = false;
    }
    constructor(
        protected apiService: ApiService,
        public router: Router,
        public modalService: ModalService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    ngOnInit(): void {
        if (typeof window !== "undefined") {
            this.getFinancialYear();
            this.getCustomerMail();
            this.getLoanDetail();
        }
    }
    getFinancialYear() {
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber");
        }
        let reqData = {
            module: "Certificate",
            action: "FinancialYear",
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
                if (response.data.statusCode === 200) {
                    this.financialYear = response.data.response;
                } else {
                    console.log("Something Went Worng");
                }
            })
            .catch((error) => {
                this.apiService.handleComponentError(error);
            });
    }
    getCustomerMail() {
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
                if (response.data.statusCode === 200) {
                    this.customerEmail = response.data.response.EMailID;
                    if (this.customerEmail == "") {
                        this.exportButtonDisabled = true;
                    }
                } else {
                    console.log("Something Went Worng");
                }
            })
            .catch((error) => {
                this.apiService.handleComponentError(error);
            });
    }
    getLoanDetail() {
        let reqData = {
            module: "Payments",
            action: "GetLoanDueInfo",
            data: {
                LoanNumber: this.LoanNumber,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                console.log("response");
                console.log(response);
                if (response.data.statusCode === 200) {
                    this.loadName = response.data.response[0].LoanType;
                } else {
                }
            })
            .catch((error) => {
                this.apiService.handleComponentError(error);
            });
    }

    sendMail() {
        if (this.finalYear == "") {
            this.finalYearError = true;
            return;
        }
        if (this.customerEmail == "") {
            this.emailError = true;
            return;
        }
        let reqData = {
            module: "Certificate",
            action: "GetInterestCertificate",
            data: {
                loanNumber: this.LoanNumber,
                finalYear: this.finalYear,
                email: this.customerEmail,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                if (response.data.statusCode === 200) {
                    this.modalService.showModal("successModalPopup");
                    this.popupMessage = response.data.response;
                } else {
                }
            })
            .catch((error) => {
                this.apiService.handleComponentError(error);
            });
    }
    viewCertificate() {
        this.downloadCertificateLoader = true;
        if (this.finalYear == "") {
            this.finalYearError = true;
            return;
        }

        let reqData = {
            module: "Certificate",
            action: "GetInterestCertificate",
            data: {
                loanNumber: this.LoanNumber,
                finalYear: this.finalYear,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                this.downloadCertificateLoader = false;
                if (response.data.statusCode === 200) {
                    this.incomeTaxCertificate = response.data.response;
                    window.open(this.incomeTaxCertificate, "_blank");
                } else {
                }
            })
            .catch((error) => {
                this.downloadCertificateLoader = false;
                this.apiService.handleComponentError(error);
            });
    }
}
