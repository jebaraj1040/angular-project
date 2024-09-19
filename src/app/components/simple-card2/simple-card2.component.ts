import { Component, Input, SimpleChanges } from "@angular/core";
import Chart from "chart.js/auto";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { RequestModalComponent } from "../request-modal/request-modal.component";
import { ApiService } from "src/app/services/api.service";
import { customerPortalConstants } from "src/constants/customer-portal";
import { environment } from "src/environments/environment";
import moment from "moment";
import { Router, RouterModule } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";

@Component({
    selector: "app-simple-card2",
    standalone: true,
    templateUrl: "./simple-card2.component.html",
    styleUrl: "./simple-card2.component.scss",
    imports: [
        CloseModalDirective,
        ModalDirective,
        SuccessModalComponent,
        RequestModalComponent,
        ComponentLoaderComponent,
        RouterModule,
    ],
})
export class SimpleCard2Component {
    myChart: any;
    selectedTab: number = 1;
    @Input() LoanNumber: any;
    paymentData: any;
    totalAmountData: any;
    payAmountData: any;
    loanInfoData: any;
    collTransactionData: any;
    loanDetailsFound: boolean = false;
    constructor(
        protected apiService: ApiService,
        public router: Router,
        public commonService: CommonService
    ) {}
    selectTab(index: number): void {
        this.selectedTab = index;
        if (index === 2) {
            this.commonService.loading = true;
            this.getCollTransaction();
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (typeof window !== "undefined") {
            if (changes["LoanNumber"]) {
                this.handleLoanNumberChanges();
            }
        }
    }
    handleLoanNumberChanges() {
        this.commonService.loading = true;
        this.getLoanDueInfo();
    }

    ngAfterViewInit(): void {
        if (typeof window !== "undefined") {
            setTimeout(() => {
                this.drawChart();
            }, 50);
        }
    }

    drawChart() {
        if (this.myChart) {
            this.myChart.destroy();
        }
        this.myChart = new Chart("chart", {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [
                            parseInt(this.totalAmountData),
                            parseInt(this.payAmountData),
                        ],
                        backgroundColor: ["#7AEBC8", "#fff"],
                        borderWidth: 0,
                        hoverBackgroundColor: ["#7AEBC8", "#fff"],
                    },
                ],
            },
            options: {
                cutout: "70%",
                rotation: 180,
                plugins: {
                    tooltip: {
                        enabled: false,
                    },
                },
            },
        });
    }
    public formatDate($event: any) {
        const date = moment($event, "DD/MM/YYYY");
        // Format the date to "MMMM-yyyy" (e.g., "May-2024")
        return date.format("MMMM - yyyy");
    }
    public formatDate2($event: any) {
        const date = moment($event, "DD/MM/YYYY");
        // Format the date to "MMMM-yyyy" (e.g., "May-2024")
        return date.format("DD MMMM yyyy");
    }

    getPaymentMode() {
        let reqData = {
            module: "Payments",
            action: "GetPaymentMode",
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
                this.loanDetailsFound = true;
                setTimeout(() => {
                    this.drawChart();
                }, 50);
                this.commonService.loading = false;
                if (response.data.statusCode === 200) {
                    this.paymentData = response.data.response[0];
                } else {
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
                LoanNumber: this.LoanNumber,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                this.getPaymentMode();
                if (response.data.statusCode === 200) {
                    this.loanInfoData = response.data.response[0];
                    this.totalAmountData =
                        response.data.response[0].LoanAmount.replace(/,/g, "");
                    this.payAmountData =
                        response.data.response[0].TotalAmountPaid.replace(
                            /,/g,
                            ""
                        );
                } else {
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    getCollTransaction() {
        let reqData = {
            module: "Payments",
            action: "GetCollTransaction",
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
                if (response.data.statusCode === 200) {
                    this.collTransactionData = response.data.response;
                    this.commonService.loading = false;
                } else {
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    incomeTax() {
        this.router.navigateByUrl(
            "/income-tax-certificate?loanId=" + this.LoanNumber
        );
    }
    raiseRequest() {
        this.router.navigateByUrl("/raise-a-request?loanId=" + this.LoanNumber);
    }
    trackRequest() {
        this.router.navigateByUrl(
            "/track-my-request?loanId=" + this.LoanNumber
        );
    }
    applyButton() {
        this.router.navigateByUrl("/payment?loanId=" + this.LoanNumber);
    }
    welcomeLetterFun() {
        this.commonService.welcomeLetter = true;
    }
}
