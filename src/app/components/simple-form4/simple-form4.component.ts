import { Component, Input } from "@angular/core";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";
import { customerPortalConstants } from "src/constants/customer-portal";
import { CommonService } from "src/app/services/common.service";
import { Router, RouterModule } from "@angular/router";
import { ComponentLoaderComponent } from "../component-loader/component-loader.component";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { numbersOnly } from "src/app/directives/generic.validators";
import { ModalService } from "src/app/services/modal.service";

@Component({
    selector: "app-simple-form4",
    standalone: true,
    imports: [
        InputFocusDirective,
        ComponentLoaderComponent,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    templateUrl: "./simple-form4.component.html",
    styleUrl: "./simple-form4.component.scss",
})
export class SimpleForm4Component {
    payment_step_1: boolean = true;
    payment_step_2: boolean = false;
    paymentLoader: boolean = false;
    paytmForm: any;
    chmod: any;
    buyerEmail: any;
    buyerPhone: any;
    buyerFirstName: any;
    buyerLastName: any;
    buyerAddress: any;
    buyerCity: any;
    buyerState: any;
    buyerCountry: any;
    buyerPinCode: any;
    orderid: any;
    amount: any;
    customvar: any;
    isocurrency: any;
    currency: any;
    txnsubtype: any;
    paramString: any;
    date: any;
    alldata: any;
    privateKey: any;
    checksum: string = "";
    key: any;
    paramsHtml: any;
    count: number = 0;
    isDeviation: any = "";
    tenure: any = 0;
    employmentType: any;
    propertyLoanFree: any;
    bre2LoanAmount: any = 0;
    onClickDataLayerValue: any = [];
    onClickSaveBtn: boolean = false;
    referer_header: any;

    @Input() LoanNumber: any;
    loanInfoData: any;
    inputAmount: any;
    loanAmount: any;
    balanceTenure: any;
    loanName: any;
    paymentData: any;
    popupMessage: any = "";
    constructor(
        protected apiService: ApiService,
        public commonService: CommonService,
        public router: Router,
        public modalService: ModalService
    ) {}
    dueAmountForm = new FormGroup({
        loanAmount: new FormControl("", [
            Validators.required,
            Validators.min(0.01),
            numbersOnly(),
        ]),
    });
    ngOnInit(): void {
        this.commonService.loading = true;
        this.getLoanDueInfo();
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
                if (response.code === 200) {
                    this.loanName = response.data.response[0].LoanType;
                    this.balanceTenure = response.data.response[0].PendingEMI;
                    this.getLoanInfo();
                    this.getPaymentMode();
                } else {
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
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
    getLoanInfo() {
        let reqData = {
            module: "Emi",
            action: "emiPayData",
            data: {
                loanNumber: this.LoanNumber,
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                if (response.code === 200) {
                    this.loanInfoData = response.data;
                    this.inputAmount = parseInt(response.data.EMIAmount);
                    const dueAmountForm: any =
                        this.dueAmountForm.get("loanAmount");
                    dueAmountForm.setValidators([
                        Validators.required,
                        Validators.min(1),
                        Validators.max(this.inputAmount),
                        numbersOnly(),
                    ]);
                    dueAmountForm.updateValueAndValidity();
                } else {
                }
            })
            .catch((error) => {
                this.commonService.loading = false;
                this.apiService.handleComponentError(error);
            });
    }
    payRequest() {
        if (this.dueAmountForm.invalid) {
            for (const control of Object.keys(this.dueAmountForm.controls)) {
                this.dueAmountForm.get(control)?.markAsTouched();
            }
            return;
        }
        this.commonService.loading = true;
        this.paymentLoader = true;
        let reqData = {
            module: "Emi",
            action: "emiPaymentPayonline",
            data: {
                Pk_id: this.loanInfoData.Pk_id,
                LoanAgreementNumber: this.loanInfoData.LoanAgreementNumber,
                UniqueReferenceNo: this.loanInfoData.UniqueReferenceNo,
                EMIAmount: parseInt(this.inputAmount),
                MobileNo: this.loanInfoData.MobileNo,
                Custname: this.loanInfoData.Custname,
                PaymentGateway: "airpay", //this.loanInfoData.PaymentGateway //todo
                CreatedBy: this.loanInfoData.CreatedBy,
                EmailID: "",
            },
        };
        let payRequestData = {
            module: "AirPay",
            action: "paymentInitiate",
            data: {
                Pk_id: this.loanInfoData.Pk_id,
                LoanAgreementNumber: this.loanInfoData.LoanAgreementNumber,
                UniqueReferenceNo: this.loanInfoData.UniqueReferenceNo,
                EMIAmount: parseInt(this.inputAmount),
                MobileNo: this.loanInfoData.MobileNo,
                Custname: this.loanInfoData.Custname,
                PaymentGateway: "airpay", //this.loanInfoData.PaymentGateway //todo
                CreatedBy: this.loanInfoData.CreatedBy,
                EmailID: "",
            },
        };
        this.apiService
            .restApiCall(
                reqData,
                environment.webSiteUrl + customerPortalConstants.api
            )
            .then((response) => {
                this.commonService.loading = false;
                if (response.code === 200) {
                    this.payment_step_2 = false;
                    this.payment_step_1 = true;
                    this.apiService.restApiCall(payRequestData,
                        environment.webSiteUrl + customerPortalConstants.api)
                    .then((res)=>{
                        setTimeout(() => {
                            
                            this.offerAccept(res);
                    }, 1000);
                    }).catch((error)=>{
                        this.apiService.handleComponentError(error);
                    });
                } else {
                    this.paymentLoader = false;
                }
            })
            .catch((error) => {
                this.apiService.handleComponentError(error);
            });
    }
    offerAccept(paymentData: any) {
        if (typeof window !== "undefined") {
            let form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute(
                "action",
                "https://payments.airpay.co.in/pay/index.php"
            );
            form.setAttribute("name", "paytmForm");
            form.setAttribute("id", "paytmForm");
            let formFields = [
                "chmod",
                "buyerEmail",
                "buyerPhone",
                "buyerFirstName",
                "buyerLastName",
                "buyerAddress",
                "buyerCity",
                "buyerState",
                "buyerCountry",
                "buyerPinCode",
                "orderid",
                "amount",
                "isocurrency",
                "currency",
                "checksum",
                "customvar",
                "privatekey",
                "mercid",
            ];

            this.paytmForm = "paytmForm";
            formFields.forEach((value) => {
                var i = document.createElement("input");
                i.type = "hidden";
                i.name = value;
                switch (value) {
                    case "buyerEmail":
                        i.value = paymentData?.data?.buyerEmail;
                        break;
                    case "chmod":
                        i.value = paymentData?.data?.chmod;
                        break;
                    case "buyerPhone":
                        i.value = paymentData?.data?.buyerPhone;
                        break;
                    case "buyerFirstName":
                        i.value = paymentData?.data?.buyerFirstName;
                        break;
                    case "buyerLastName":
                        i.value = paymentData?.data?.buyerFirstName;
                        break;
                    case "buyerAddress":
                        i.value = paymentData?.data?.buyerAddress;
                        break;
                    case "buyerCity":
                        i.value = paymentData?.data?.buyerCity;
                        break;
                    case "buyerState":
                        i.value = paymentData?.data?.buyerState;
                        break;
                    case "buyerCountry":
                        i.value = "India";
                        break;
                    case "buyerPinCode":
                        i.value = paymentData?.data?.buyerPinCode;
                        break;
                    case "orderid":
                        i.value = paymentData?.data?.orderid;
                        break;
                    case "amount":
                        i.value = paymentData?.data?.amount;
                        break;
                    case "isocurrency":
                        i.value = "INR";
                        break;
                    case "currency":
                        i.value = "356";
                        break;
                    case "mercid":
                        i.value = paymentData?.data?.code;
                        break;
                    case "checksum":
                        i.value = paymentData?.data?.checksum;
                        break;
                    case "customvar":
                        i.value = paymentData?.data?.customvar;
                        break;
                    case "privatekey":
                        i.value = paymentData?.data?.privatekey;
                        break;
                }
                form.appendChild(i);
            });
            document.body.appendChild(form);
            
            document.forms[this.paytmForm].submit();
            
        }
    }
    backHome() {
        this.router.navigateByUrl("/loan-listing");
    }
}
