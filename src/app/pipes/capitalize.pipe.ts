import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "capitalize",
    standalone: true,
})
export class CapitalizePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return value;
        const words = value.split("_");
        const capitalizedWords = words.map((word) => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(" ");
    }
}
