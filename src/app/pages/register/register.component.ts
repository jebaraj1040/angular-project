import { Component } from "@angular/core";
import { CardInfoComponent } from "../../components/card-info/card-info.component";
import { SimpleForm2Component } from "../../components/simple-form2/simple-form2.component";

@Component({
    selector: "app-register",
    standalone: true,
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
    imports: [CardInfoComponent, SimpleForm2Component],
})
export class RegisterComponent {}
