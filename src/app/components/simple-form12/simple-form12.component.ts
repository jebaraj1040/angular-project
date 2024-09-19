import { Component, PLATFORM_ID, Inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import { customerPortalConstants } from "src/constants/customer-portal";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import { CommonService } from "src/app/services/common.service";
import { SimpleCard5Component } from "../simple-card5/simple-card5.component";
import { ToastComponent } from "../toast/toast.component";

@Component({
    selector: "app-simple-form12",
    standalone: true,
    imports: [
        ComponentLoaderComponent,
        SimpleCard5Component,
        ToastComponent,
        RouterModule,
    ],
    templateUrl: "./simple-form12.component.html",
    styleUrl: "./simple-form12.component.scss",
})
export class SimpleForm12Component {
    autoDebitAvailability: any = 0;
    autoDebitData: any;
    mobileNumber: any;
    autoDebitError: any;
    constructor(
        protected apiService: ApiService,
        public router: Router,
        public commonService: CommonService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    ngOnInit(): void {
        this.commonService.loading = true;
        if (typeof window !== "undefined") {
            this.getAutoDebitView();
        }
    }
    getAutoDebitView() {
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
                if (response.data.statusCode === 200) {
                    this.commonService.loading = false;
                    this.autoDebitData = response.data.response;
                    this.autoDebitAvailability =
                        response.data.response[0]["ErrorMessage"] == "" ? 1 : 2;
                } else {
                    this.autoDebitError = "Something Went Wrong !";
                    setTimeout(() => {
                        this.autoDebitError = "";
                    }, 3000);
                    this.commonService.loading = false;
                }
            })
            .catch((error) => {
                this.autoDebitError = "Something Went Wrong !";
                setTimeout(() => {
                    this.autoDebitError = "";
                }, 3000);
                this.commonService.loading = false;
                console.log("error");
                console.log(error);
                this.apiService.handleComponentError(error);
            });
    }
    cancelAutoDebit(LoanNumber: any) {
        if (isPlatformBrowser(this.platformId)) {
            this.mobileNumber = localStorage.getItem("mobileNumber");
        }
        let reqData = {
            module: "AutoDebitSettings",
            action: "GetLoanNachSts",
            data: {
                mobileNumber: this.mobileNumber,
                source: "",
                loanNumber: LoanNumber,
            },
        };
        console.log(reqData);

        // this.apiService
        //     .restApiCall(
        //         reqData,
        //         environment.webSiteUrl + customerPortalConstants.api
        //     )
        //     .then((response) => {
        //         if (response.statusCode === 200) {
        //         } else {
        //             alert("Something Went Worng");
        //         }
        //     })
        //     .catch((error) => {
        //         console.log("error");
        //         console.log(error);
        //         this.apiService.handleComponentError(error);
        //     });
    }
}
