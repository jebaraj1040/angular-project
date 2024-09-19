import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "escapeEntityHtmlPipe",
})
export class EscapeEntityHtmlPipePipe implements PipeTransform {
    static transform(title: any): any {
        return contentTransform(title);
    }
    transform(value: string) {
        return contentTransform(value);
    }
}
function contentTransform(value: any) {
    if (typeof document == "undefined") {
        return value;
    }
    const span = document.createElement("span");
    return value.replace(/&[#A-Za-z0-9]+;/gi, (entity: string) => {
        span.innerHTML = entity;
        return span.innerText;
    });
}
