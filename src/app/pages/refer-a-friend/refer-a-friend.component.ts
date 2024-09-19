import { Component } from "@angular/core";
import { SimpleForm11Component } from "../../components/simple-form11/simple-form11.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";

@Component({
    selector: "app-refer-a-friend",
    standalone: true,
    templateUrl: "./refer-a-friend.component.html",
    styleUrl: "./refer-a-friend.component.scss",
    imports: [SimpleForm11Component, SideBarComponent],
})
export class ReferAFriendComponent {}
