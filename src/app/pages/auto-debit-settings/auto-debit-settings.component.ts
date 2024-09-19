import { Component } from "@angular/core";
import { SimpleForm12Component } from "../../components/simple-form12/simple-form12.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";

@Component({
    selector: "app-auto-debit-settings",
    standalone: true,
    templateUrl: "./auto-debit-settings.component.html",
    styleUrl: "./auto-debit-settings.component.scss",
    imports: [SimpleForm12Component, SideBarComponent],
})
export class AutoDebitSettingsComponent {}
