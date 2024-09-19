import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
    name: 'datepipe',
})
export class DateFormatPipe implements PipeTransform {
    constructor(private datepipe: DatePipe) {}
    transform(value: any): any {
        let formatedDate = this.datepipe.transform(value, 'dd/MM/yyyy');
        return formatedDate;
    }
}
