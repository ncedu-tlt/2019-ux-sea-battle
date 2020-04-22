import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./components/auth/auth.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { GuestGuard } from "./guards/guest.guard";

const routes: Routes = [
    {
        path: "login",
        component: AuthComponent,
        canActivate: [GuestGuard]
    },
    {
        path: "registration",
        component: RegistrationComponent,
        canActivate: [GuestGuard]
    },
    {
        path: "**",
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
