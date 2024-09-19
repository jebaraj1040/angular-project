import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { SimpleCard4Component } from "../../components/simple-card4/simple-card4.component";

@Component({
    selector: "app-enach-form",
    standalone: true,
    templateUrl: "./enach-form.component.html",
    styleUrl: "./enach-form.component.scss",
    imports: [SideBarComponent, SimpleCard4Component],
})
export class EnachFormComponent {}
