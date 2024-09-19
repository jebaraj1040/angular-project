import { Directive, HostListener } from "@angular/core";
import { ModalService } from "../services/modal.service";

@Directive({
    selector: "[data-modal-dismiss]",
    standalone: true,
})
export class CloseModalDirective {
    constructor(private modalService: ModalService) {}

    @HostListener("click") onClick() {
        this.closeModal();
    }

    closeModal() {
        this.modalService.closeModal();
    }
}
