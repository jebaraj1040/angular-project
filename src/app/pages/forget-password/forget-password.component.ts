import { Component } from "@angular/core";
import { CardInfoComponent } from "../../components/card-info/card-info.component";
import { SimpleForm3Component } from "../../components/simple-form3/simple-form3.component";

@Component({
    selector: "app-forget-password",
    standalone: true,
    templateUrl: "./forget-password.component.html",
    styleUrl: "./forget-password.component.scss",
    imports: [CardInfoComponent, SimpleForm3Component],
})
export class ForgetPasswordComponent {}
