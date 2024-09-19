import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { SimpleCard2Component } from "../../components/simple-card2/simple-card2.component";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-loan-details",
    standalone: true,
    templateUrl: "./loan-details.component.html",
    styleUrl: "./loan-details.component.scss",
    imports: [SimpleCard2Component, SideBarComponent],
})
export class LoanDetailsComponent {
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
