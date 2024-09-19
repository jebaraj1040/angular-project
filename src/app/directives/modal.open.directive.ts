import { Directive, HostListener, ElementRef } from "@angular/core";
import { ModalService } from "../services/modal.service";
@Directive({
    selector: "[data-modal-target]",
    standalone: true,
})
export class ModalDirective {
    constructor(
        private modalService: ModalService,
        public elementRef: ElementRef
    ) {}

    @HostListener("click") onClick() {
        let element = this.elementRef.nativeElement;
        this.openModal(element);
    }

    openModal(element: any) {
        this.modalService.openModal(element);
    }
}
