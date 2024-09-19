import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { SimpleForm8Component } from "../../components/simple-form8/simple-form8.component";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-change-password",
    standalone: true,
    templateUrl: "./change-password.component.html",
    styleUrl: "./change-password.component.scss",
    imports: [SideBarComponent, SimpleForm8Component],
})
export class ChangePasswordComponent {
    constructor(public commonService: CommonService) {}
    ngOnInit(): void {
        this.commonService.emailUpdateError = "";
    }
}
