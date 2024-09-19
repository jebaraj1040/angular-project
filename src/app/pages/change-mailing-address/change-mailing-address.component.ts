import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { SimpleForm6Component } from "../../components/simple-form6/simple-form6.component";

@Component({
    selector: "app-change-mailing-address",
    standalone: true,
    templateUrl: "./change-mailing-address.component.html",
    styleUrl: "./change-mailing-address.component.scss",
    imports: [SideBarComponent, SimpleForm6Component],
})
export class ChangeMailingAddressComponent {}
