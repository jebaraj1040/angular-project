import { Component, PLATFORM_ID, Inject, Input } from "@angular/core";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "src/environments/environment";
import { customerPortalConstants } from "src/constants/customer-portal";
import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { ModalService } from "src/app/services/modal.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import { certificateApiMessages } from "src/constants/certificateApiMessages";

@Component({
    selector: "app-request-modal",
    standalone: true,
    imports: [CloseModalDirective, ModalDirective, ComponentLoaderComponent],
    templateUrl: "./request-modal.component.html",
    styleUrl: "./request-modal.component.scss",
})
export class RequestModalComponent {
    mobileNumber: any;
    addressData: any;
    @Input() LoanNumber: any;
    @Input() loanInfoData: any;

    ngOnInit(): void {
        this.getAddressDetailsView();
    }
    constructor(
        protected apiService: ApiService,
        public commonService: CommonService,
        public modalService: ModalService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    getAddressDetailsView() {
        this.commonService.loading = true;
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
                    this.addressData = response.data.response;
                } else {
                    console.log("error");
                }
            })
            .catch((error) => {
                console.log("error");
                console.log(error);
                this.apiService.handleComponentError(error);
            });
    }
    welcomeLetterClick() {
        if (this.commonService.welcomeLetter) {
            let reqData = {
                module: "Certificate",
                action: "WelcomeLetter",
                data: {
                    Unit: certificateApiMessages.Unit,
                    Company: certificateApiMessages.Company,
                    product: this.loanInfoData.LoanType,
                    PrintType: certificateApiMessages.PrintType,
                    LoanNo: this.LoanNumber,
                    Header: certificateApiMessages.Header,
                },
            };
            this.apiService
                .restApiCall(
                    reqData,
                    environment.webSiteUrl + customerPortalConstants.api
                )
                .then((response) => {
                    this.commonService.loading = false;
                    if (response.data.statusCode === "200") {
                        const contentType = "application/pdf";
                        const blob = this.b64toBlob(
                            response.data.response,
                            contentType
                        );
                        const blobUrl = URL.createObjectURL(blob);

                        window.open(blobUrl, "_blank");
                        this.modalService.closeModal();
                        this.commonService.welcomeLetter = false;
                    } else {
                        console.log("errors");
                    }
                })
                .catch((error) => {
                    this.commonService.loading = false;
                    console.log("error");
                    this.apiService.handleComponentError(error);
                });
        }
    }
    b64toBlob = (captcha: any, contentType = "", sliceSize = 512) => {
        const byteCharacters = atob(captcha);
        const byteArrays = [];
        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
    back() {
        this.commonService.welcomeLetter = false;
    }
}
