import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-quick-links",
    standalone: true,
    imports: [RouterModule],
    templateUrl: "./quick-links.component.html",
    styleUrl: "./quick-links.component.scss",
})
export class QuickLinksComponent {
    constructor(public router: Router, public commonService: CommonService) {}
    changePath(path: any) {
        this.commonService.emailUpdateOtp = false;
        this.commonService.emailUpdateError = "";
        this.router.navigate([path]);
    }
}
