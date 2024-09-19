import { Component } from "@angular/core";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-component-loader",
    standalone: true,
    imports: [],
    templateUrl: "./component-loader.component.html",
    styleUrl: "./component-loader.component.scss",
})
export class ComponentLoaderComponent {
    constructor(protected commonService: CommonService) {}
}
