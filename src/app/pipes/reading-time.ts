import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'readingTime',
})
export class ReadingTimePipe implements PipeTransform {
    wordCount: any;
    words: any;
    readTime: any = 0;
    finalReadingTime: number = 1;
    transform(value: string): unknown {
        this.words = value ? value.split(/\s+/) : 0;
        this.wordCount = this.words ? this.words.length : 0;
        this.readTime = this.wordCount > 0 ? (this.wordCount / 238) * 60 : 0;
        if (this.wordCount >= 238 && this.wordCount != 0) {
            this.readTime = (this.wordCount / 238) * 60;
            this.finalReadingTime = this.readTime
                ? Math.round(this.readTime / 60)
                : 0;
        } else if (this.wordCount < 238 && this.wordCount != 0) {
            this.readTime = 1;
        }
        return this.finalReadingTime + ' min read';
    }
}
