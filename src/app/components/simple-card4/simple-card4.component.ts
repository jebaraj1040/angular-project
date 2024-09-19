import { Component, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgScrollbarModule } from "ngx-scrollbar";
import {
    selectBoxHide,
    selectBoxInput,
    selectBoxOption,
} from "src/app/utilities/selectBox.utilities";
import { InputFocusDirective } from "src/app/directives/input.focus.directive";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";

@Component({
    selector: "app-simple-card4",
    standalone: true,
    templateUrl: "./simple-card4.component.html",
    styleUrl: "./simple-card4.component.scss",
    imports: [
        CommonModule,
        NgScrollbarModule,
        InputFocusDirective,
        SuccessModalComponent,
        CloseModalDirective,
        ModalDirective,
    ],
})
export class SimpleCard4Component {
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
