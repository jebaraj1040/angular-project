import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-simple-card3",
    standalone: true,
    imports: [],
    templateUrl: "./simple-card3.component.html",
    styleUrl: "./simple-card3.component.scss",
})
export class SimpleCard3Component {
    selectedTab: number = 1;
    @Input() LoanNumber: any;
    serviceRequestFocus: any;
    constructor(public router: Router, public commonService: CommonService) {}
    selectTab(index: number): void {
        this.selectedTab = index;
    }
    ngOnInit(): void {
        if (this.commonService.transferData) {
            this.selectedTab = 3;
        }
    }
}
