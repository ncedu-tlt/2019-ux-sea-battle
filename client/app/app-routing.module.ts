import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegistrationComponent } from "./components/registration/registration.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

const routes: Routes = [
    {
        path: "registration",
        component: RegistrationComponent
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
