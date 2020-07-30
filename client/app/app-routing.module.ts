import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./components/auth/auth.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { GuestGuard } from "./guards/guest.guard";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { GameSearchComponent } from "./components/game-search/game-search.component";
import { GameComponent } from "./components/game/game.component";
import { AuthGuard } from "./guards/auth.guard";
import { EditProfileComponent } from "./components/edit-profile/edit-profile.component";

const routes: Routes = [
    {
        path: "",
        component: MainMenuComponent,
        canActivate: [AuthGuard]
    },
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
        path: "search",
        component: GameSearchComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "game",
        component: GameComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "edit",
        component: EditProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "**",
        redirectTo: ""
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
