import { Component } from "@angular/core";
import { SliderComponent } from "../slider/slider.component";
import { QuickLinksComponent } from "../quick-links/quick-links.component";
import { CardInfo2Component } from "../card-info2/card-info2.component";

@Component({
    selector: "app-side-bar",
    standalone: true,
    templateUrl: "./side-bar.component.html",
    styleUrl: "./side-bar.component.scss",
    imports: [SliderComponent, QuickLinksComponent, CardInfo2Component],
})
export class SideBarComponent {}
