import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";

@Component({
    selector: "app-simple-card5",
    standalone: true,
    imports: [RouterModule],
    templateUrl: "./simple-card5.component.html",
    styleUrl: "./simple-card5.component.scss",
})
export class SimpleCard5Component {
    constructor(public router: Router) {}
}
