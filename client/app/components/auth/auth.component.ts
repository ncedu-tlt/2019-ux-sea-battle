import { CookieService } from "ngx-cookie-service";
import { AuthApiService } from "./../../services/api/auth.api.service";
import { LoginRequestDTO } from "common/dto/login-request.dto";
import { Router } from "@angular/router";
import { Component } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl
} from "@angular/forms";

@Component({
    selector: "sb-auth-form",
    templateUrl: "./auth.component.html",
    styleUrls: ["./auth.component.less"]
})
export class AuthComponent {
    constructor(
        private fb: FormBuilder,
        private authService: AuthApiService,
        private router: Router,
        private cookieService: CookieService
    ) {}

    serverErrors: number;

    authForm: FormGroup = this.fb.group({
        email: [
            "",
            Validators.compose([
                Validators.required,
                Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
            ])
        ],
        password: [
            "",
            Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(20)
            ])
        ]
    });

    get _email(): AbstractControl {
        return this.authForm.get("email");
    }

    get _password(): AbstractControl {
        return this.authForm.get("password");
    }

    onSubmit(): void {
        this.serverErrors = null;
        const user: LoginRequestDTO = {
            email: this.authForm.value.email,
            password: this.authForm.value.password
        };
        if (this.authForm.valid) {
            this.authService.login(user).subscribe(
                data => {
                    this.cookieService.set("accessToken", data.accessToken);
                    this.router.navigate(["/"]);
                },
                err => {
                    this.serverErrors = err.error.statusCode;
                }
            );
        }
    }
}
