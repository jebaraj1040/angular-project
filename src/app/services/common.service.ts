import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class CommonService {
    constructor() {}
    loading: any = false;
    transferData: any;
    welcomeLetter: boolean = false;
    emailUpdateOtp: boolean = false;
    emailUpdateError: any;
}
