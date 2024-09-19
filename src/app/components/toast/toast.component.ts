import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: "app-toast",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./toast.component.html",
    styleUrl: "./toast.component.scss",
})
export class ToastComponent {
    @Input() showToastMsg: any;
}
