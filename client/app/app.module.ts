import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RegistrationComponent } from "./components/registration/registration.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthComponent } from "./components/auth/auth.component";
import { AuthHttpInterceptor } from "./interceptors/auth.interceptor";
import { CookieService } from "ngx-cookie-service";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { LoadingScreenComponent } from "./components/loading-screen/loading-screen.component";
import { GameComponent } from "./components/game/game.component";
import { SocketIoModule } from "ngx-socket-io";
import { MatchmakingSocket } from "./sockets/matchmaking.socket";

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        RegistrationComponent,
        NotFoundComponent,
        MainMenuComponent,
        LoadingScreenComponent,
        GameComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        SocketIoModule
    ],
    providers: [
        CookieService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true
        },
        MatchmakingSocket
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
