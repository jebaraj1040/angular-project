import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Injectable({
    providedIn: "root",
})
export class ApiService {
    public baseURL = "";
    previewParam: any;
    currentUrl: string;
    transData: any;
    webFormErr: boolean = false;
    err: Error | null | undefined;
    constructor(
        private http: HttpClient,
        private router: Router,
        private location: Location
    ) {
        this.currentUrl = this.location.path();
    }

    getRestApiCall(endPointUrl: string): Promise<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "api-version": "v1",
            }),
        };
        return new Promise((resolve, reject) => {
            this.http.get(endPointUrl, httpOptions).subscribe(
                (res: any) => {
                    resolve(res);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    restApiCall(reqData: any, endPointUrl: string): Promise<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                "api-version": "v1",
            }),
        };
        return new Promise((resolve, reject) => {
            this.http.post(endPointUrl, reqData, httpOptions).subscribe(
                (res: any) => {
                    resolve(res);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    public handleError(error: HttpErrorResponse) {
        if (error.status) {
            console.error(
                `Backend returned code ${error.status}, body was: `,
                error.error
            );
        }
        return throwError(() => new Error(JSON.stringify(error.error)));
    }

    public handlePageError(error: HttpErrorResponse) {
        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 403:
                    this.redirectTo("/403");
                    break;
                case 404:
                    this.redirectTo("/not-found");
                    break;
                case 503:
                    this.redirectTo("/under-maintenance");
                    break;
                default:
                    this.handleDefaultError(error);
            }
        } else {
            this.handleUnknownError();
        }
    }

    private redirectTo(path: string) {
        if (typeof window !== "undefined") {
            window.location.href = path;
        } else {
            this.router.navigate([path]);
        }
    }

    private handleDefaultError(error: HttpErrorResponse) {
        if (environment.env === "dev") {
            console.log(
                `API returned code ${error.status}, body was: `,
                error.error
            );
        } else {
            console.error("Something bad happened; please try again later.");
        }
    }

    private handleUnknownError() {
        if (environment.env === "dev") {
            console.log("API error: Unknown error");
        } else {
            console.error("Something bad happened; please try again later.");
        }
    }

    public handleComponentError(error: HttpErrorResponse) {
        if (error instanceof HttpErrorResponse) {
            if (environment.env == "dev") {
                console.log(
                    `API returned code ${error.status}, body was: `,
                    error.error
                );
            } else {
                console.error(
                    "Something bad happened; please try again later."
                );
            }
        } else if (environment.env == "dev") {
            this.webFormErr = true;
            this.err = error;
            if (typeof window != "undefined") {
                setTimeout(() => {
                    this.webFormErr = false;
                    window.location.href = window?.location?.pathname;
                }, 1000);
            }
        } else {
            console.error("Something bad happened; please try again later.");
        }
    }
}
