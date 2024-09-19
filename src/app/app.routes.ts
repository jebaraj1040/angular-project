import { Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";

export const routes: Routes = [
    {
        path: "",
        loadComponent: () =>
            import("./pages/login/login.component").then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: "register",
        loadComponent: () =>
            import("./pages/register/register.component").then(
                (m) => m.RegisterComponent
            ),
    },
    {
        path: "forget",
        loadComponent: () =>
            import("./pages/forget-password/forget-password.component").then(
                (m) => m.ForgetPasswordComponent
            ),
    },
    {
        path: "loan-listing",
        loadComponent: () =>
            import("./pages/loan-listing/loan-listing.component").then(
                (m) => m.LoanListingComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "loan-details",
        loadComponent: () =>
            import("./pages/loan-details/loan-details.component").then(
                (m) => m.LoanDetailsComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "payment",
        loadComponent: () =>
            import("./pages/payment/payment.component").then(
                (m) => m.PaymentComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "track-my-request",
        loadComponent: () =>
            import("./pages/track-my-request/track-my-request.component").then(
                (m) => m.TrackMyRequestComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "raise-a-request",
        loadComponent: () =>
            import("./pages/raise-a-request/raise-a-request.component").then(
                (m) => m.RaiseARequestComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "change-mailing-address",
        loadComponent: () =>
            import(
                "./pages/change-mailing-address/change-mailing-address.component"
            ).then((m) => m.ChangeMailingAddressComponent),
        canActivate: [AuthGuard],
    },
    {
        path: "enach-form",
        loadComponent: () =>
            import("./pages/enach-form/enach-form.component").then(
                (m) => m.EnachFormComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "change-email-id",
        loadComponent: () =>
            import("./pages/change-email-id/change-email-id.component").then(
                (m) => m.ChangeEmailIdComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "change-password",
        loadComponent: () =>
            import("./pages/change-password/change-password.component").then(
                (m) => m.ChangePasswordComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "income-tax-certificate",
        loadComponent: () =>
            import(
                "./pages/income-tax-certificate/income-tax-certificate.component"
            ).then((m) => m.IncomeTaxCertificateComponent),
        canActivate: [AuthGuard],
    },
    {
        path: "apply-loan",
        loadComponent: () =>
            import("./pages/apply-loan/apply-loan.component").then(
                (m) => m.ApplyLoanComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "write-to-us",
        loadComponent: () =>
            import("./pages/write-to-us/write-to-us.component").then(
                (m) => m.WriteToUsComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "refer-a-friend",
        loadComponent: () =>
            import("./pages/refer-a-friend/refer-a-friend.component").then(
                (m) => m.ReferAFriendComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "auto-debit-settings",
        loadComponent: () =>
            import(
                "./pages/auto-debit-settings/auto-debit-settings.component"
            ).then((m) => m.AutoDebitSettingsComponent),
        canActivate: [AuthGuard],
    },
    {
        path: "demo",
        loadComponent: () =>
            import("./pages/demo/demo.component").then((m) => m.DemoComponent),
    },
    {
        path: "**",
        redirectTo: "/login",
    },
];
