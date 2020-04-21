import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RegistrationComponent } from "./components/registration/registration.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthComponent } from "./components/auth/auth.component";
import { TokenInterceptorService } from "./services/token-interceptor.service";
import { CookieService } from "ngx-cookie-service";

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        RegistrationComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [
        CookieService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
