import { Component } from "@angular/core";
import { SimpleCardComponent } from "../../components/simple-card/simple-card.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";

@Component({
    selector: "app-loan-listing",
    standalone: true,
    templateUrl: "./loan-listing.component.html",
    styleUrl: "./loan-listing.component.scss",
    imports: [SimpleCardComponent, SideBarComponent],
})
export class LoanListingComponent {
    userName: any;
    ngOnInit() {
        this.userName = localStorage.getItem("userName");
    }
}
