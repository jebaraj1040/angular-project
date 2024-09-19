import { Component } from "@angular/core";
import { SideBarComponent } from "src/app/components/side-bar/side-bar.component";
import { SimpleCard3Component } from "src/app/components/simple-card3/simple-card3.component";
import { ActivatedRoute } from "@angular/router";
@Component({
    selector: "app-track-my-request",
    standalone: true,
    imports: [SimpleCard3Component, SideBarComponent],
    templateUrl: "./track-my-request.component.html",
    styleUrl: "./track-my-request.component.scss",
})
export class TrackMyRequestComponent {
    loanNumber: any;
    constructor(public route: ActivatedRoute) {}
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params["loanId"]) {
                this.loanNumber = params["loanId"];
            }
        });
    }
}
