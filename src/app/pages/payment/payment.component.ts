import { Component } from "@angular/core";
import { SimpleForm4Component } from "../../components/simple-form4/simple-form4.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-payment",
    standalone: true,
    templateUrl: "./payment.component.html",
    styleUrl: "./payment.component.scss",
    imports: [SimpleForm4Component, SideBarComponent],
})
export class PaymentComponent {
    LoanNumber: any;
    LoanName: any;
    constructor(public route: ActivatedRoute) {}
    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            if (params["loanId"]) {
                this.LoanNumber = params["loanId"];
            }
        });
    }
}
