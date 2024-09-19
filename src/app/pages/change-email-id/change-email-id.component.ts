import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { SimpleForm7Component } from "../../components/simple-form7/simple-form7.component";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-change-email-id",
    standalone: true,
    templateUrl: "./change-email-id.component.html",
    styleUrl: "./change-email-id.component.scss",
    imports: [SideBarComponent, SimpleForm7Component],
})
export class ChangeEmailIdComponent {
    constructor(public commonService: CommonService) {}
    ngOnInit(): void {
        this.commonService.emailUpdateError = "";
    }
}
