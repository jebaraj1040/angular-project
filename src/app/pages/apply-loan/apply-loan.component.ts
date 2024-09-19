import { Component } from "@angular/core";
import { ApplyLoanModalComponent } from "../../components/apply-loan-modal/apply-loan-modal.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";

@Component({
    selector: "app-apply-loan",
    standalone: true,
    templateUrl: "./apply-loan.component.html",
    styleUrl: "./apply-loan.component.scss",
    imports: [ApplyLoanModalComponent, SideBarComponent],
})
export class ApplyLoanComponent {}
