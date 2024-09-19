import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ standalone: true, selector: '[data-type="input"]' })
export class InputFocusDirective {
    constructor(private element: ElementRef) {}
    @HostListener('focus')
    focus() {
        this.element.nativeElement.parentElement.classList.add('focused');
    }

    @HostListener('blur')
    blur() {
        var inputType = (this.element.nativeElement as HTMLInputElement).type;
        //restrict focus out for date input type alone
        if (inputType !== 'date') {
            if (this.element.nativeElement.value != '') {
                this.element.nativeElement.parentElement.classList.add(
                    'focused'
                );
            } else if (this.element.nativeElement.value == '') {
                this.element.nativeElement.parentElement.classList.remove(
                    'focused'
                );
            }
        }
    }
}
