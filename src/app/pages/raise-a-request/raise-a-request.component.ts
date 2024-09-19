import { Component } from "@angular/core";
import { SideBarComponent } from "src/app/components/side-bar/side-bar.component";
import { SimpleForm5Component } from "src/app/components/simple-form5/simple-form5.component";

@Component({
    selector: "app-raise-a-request",
    standalone: true,
    imports: [SimpleForm5Component, SideBarComponent],
    templateUrl: "./raise-a-request.component.html",
    styleUrl: "./raise-a-request.component.scss",
})
export class RaiseARequestComponent {}
