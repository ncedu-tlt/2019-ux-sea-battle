import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RegistrationComponent } from "./components/registration/registration.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthComponent } from "./components/auth/auth.component";
import { AuthHttpInterceptor } from "./interceptors/auth.interceptor";
import { CookieService } from "ngx-cookie-service";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { GameSearchComponent } from "./components/game-search/game-search.component";
import { GameComponent } from "./components/game/game.component";
import { SocketIoModule } from "ngx-socket-io";
import { MatchmakingSocket } from "./sockets/matchmaking.socket";
import { InlineSVGModule } from "ng-inline-svg";
import { BattlefieldComponent } from "./components/battlefield/battlefield.component";

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        RegistrationComponent,
        MainMenuComponent,
        GameSearchComponent,
        GameComponent,
        BattlefieldComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        SocketIoModule,
        InlineSVGModule.forRoot({ baseUrl: "assets/" })
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
