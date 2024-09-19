import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { SimpleForm9Component } from "../../components/simple-form9/simple-form9.component";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-income-tax-certificate",
    standalone: true,
    templateUrl: "./income-tax-certificate.component.html",
    styleUrl: "./income-tax-certificate.component.scss",
    imports: [SideBarComponent, SimpleForm9Component],
})
export class IncomeTaxCertificateComponent {
    LoanNumber: any;
    constructor(public route: ActivatedRoute) {}
    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            if (params["loanId"]) {
                this.LoanNumber = params["loanId"];
            }
        });
    }
}
