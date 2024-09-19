import { Component } from "@angular/core";
import { SimpleForm10Component } from "../../components/simple-form10/simple-form10.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";

@Component({
    selector: "app-write-to-us",
    standalone: true,
    templateUrl: "./write-to-us.component.html",
    styleUrl: "./write-to-us.component.scss",
    imports: [SimpleForm10Component, SideBarComponent],
})
export class WriteToUsComponent {}
