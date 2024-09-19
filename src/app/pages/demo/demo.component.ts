import { Component, HostListener } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgScrollbarModule } from "ngx-scrollbar";
import {
    selectBoxHide,
    selectBoxInput,
    selectBoxOption,
} from "src/app/utilities/selectBox.utilities";
import { RouterModule } from "@angular/router";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { environment } from "src/environments/environment.dev";

@Component({
    selector: "app-demo",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NgScrollbarModule,
        MatNativeDateModule,
        MatDatepickerModule,
        InputFocusDirective,
        NgOptimizedImage,
    ],
    templateUrl: "./demo.component.html",
    styleUrl: "./demo.component.scss",
})
export class DemoComponent {
    assetsCDNUrl = environment.assetsCDNUrl;
    @HostListener("click") onDocumentClick() {
        selectBoxHide("show");
    }
    handler__selectInput($event: any) {
        selectBoxInput($event);
    }
    handler__selectBox($event: any) {
        $event.stopImmediatePropagation();
    }
    handler__selectOption($event: any) {
        selectBoxOption($event);
    }
}
