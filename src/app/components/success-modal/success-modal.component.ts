import { Component, Input } from "@angular/core";
import { CloseModalDirective } from "src/app/directives/modal.close.directive";
import { ModalDirective } from "src/app/directives/modal.open.directive";

@Component({
    selector: "app-success-modal",
    standalone: true,
    imports: [CloseModalDirective, ModalDirective],
    templateUrl: "./success-modal.component.html",
    styleUrl: "./success-modal.component.scss",
})
export class SuccessModalComponent {
    @Input() requestId: string = "";
    @Input() popupMessage: string = "";
    @Input() labels: any;
}
