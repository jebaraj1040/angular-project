import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, PLATFORM_ID, Inject } from "@angular/core";
import { SimpleCard5Component } from "../simple-card5/simple-card5.component";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import { customerPortalConstants } from "src/constants/customer-portal";
import { Router } from "@angular/router";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import { CommonService } from "src/app/services/common.service";
import { ToastComponent } from "../toast/toast.component";

@Component({
    selector: "app-simple-card",
    standalone: true,
    templateUrl: "./simple-card.component.html",
    styleUrl: "./simple-card.component.scss",
    imports: [
        CommonModule,
        SimpleCard5Component,
        ComponentLoaderComponent,
        ToastComponent,
    ],
})
export class SimpleCardComponent {
    loanIsFound: boolean = false;
    noLoanFound: boolean = false;
    data: any;
    mobileNumber: any;
    loanError: any;
    constructor(
        protected apiService: ApiService,
        public router: Router,
        public commonService: CommonService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        this.commonService.loading = true;
        if (typeof window !== "undefined") {
            this.getLoanDetailsView();
        }
    }

    getLoanDetailsView() {
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber");
        }
        let reqData = {
            module: "Loans",
            action: "GetLoanBasicDetailsView",
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
                    this.data = response.data.response;
                    if (this.data[0].ErrorMessage === "No Details Found") {
                        this.loanIsFound = false;
                        this.noLoanFound = true;
                    } else {
                        this.loanIsFound = true;
                        this.noLoanFound = false;
                    }
                } else {
                    this.loanIsFound = false;
                    this.noLoanFound = true;
                    this.loanError = "Something Went Wrong !";
                    setTimeout(() => {
                        this.loanError = "";
                    }, 3000);
                }
            })
            .catch((error) => {
                this.loanIsFound = false;
                this.noLoanFound = true;
                this.loanError = "Something Went Wrong !";
                setTimeout(() => {
                    this.loanError = "";
                }, 3000);
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    loanDetails(loanId: any) {
        this.router.navigateByUrl("/loan-details?loanId=" + loanId);
    }
}
