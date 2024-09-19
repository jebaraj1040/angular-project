import { Directive, ElementRef, HostListener } from '@angular/core';
import { Accordion } from '../utilities/accordion.utilities';
@Directive({ standalone: true, selector: '[data-accordion-heading]' })
export class AccordionDirective {
    constructor(private element: ElementRef) {}

    @HostListener('click') onClick() {
        let element = this.element.nativeElement;
        let multiple = element
            .closest('[data-accordion-section]')
            .getAttribute('data-accordion-multiple');
        Accordion(element, multiple);
    }
}
