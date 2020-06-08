import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./components/auth/auth.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { GuestGuard } from "./guards/guest.guard";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { LoadingScreenComponent } from "./components/loading-screen/loading-screen.component";
import { GameComponent } from "./components/game/game.component";
import { AuthGuard } from "./guards/auth.guard";

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
        path: "menu",
        component: MainMenuComponent
    },
    {
        path: "loading",
        component: LoadingScreenComponent
    },
    {
        path: "game",
        component: GameComponent,
        canActivate: [AuthGuard]
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
