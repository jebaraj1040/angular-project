import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
    name: 'dateTimepipe',
})
export class DateTimeFormatPipe implements PipeTransform {
    constructor(private dateTimepipe: DatePipe) {}
    transform(value: any): any {
        let formatedDate = this.dateTimepipe.transform(
            value,
            'dd/MM/yyyy h:mm:ss a'
        );
        return formatedDate;
    }
}
