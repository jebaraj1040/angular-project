import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-success-card",
    standalone: true,
    imports: [RouterModule],
    templateUrl: "./success-card.component.html",
    styleUrl: "./success-card.component.scss",
})
export class SuccessCardComponent {
    @Input() message: any;
}
