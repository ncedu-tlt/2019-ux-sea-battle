import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserDTO } from "./../../../common/dto/user.dto";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class CurrentUserService {
    private userSubject = new Subject<UserDTO>();
    private user = this.userSubject.asObservable();

    constructor(private httpClient: HttpClient) {
        this.fetchCurrentUser();
    }

    fetchCurrentUser(): void {
        this.httpClient
            .get<UserDTO>("/api/users/current")
            .subscribe((u: UserDTO) => this.userSubject.next(u));
    }

    getCurrentUser(): Observable<UserDTO> {
        return this.user;
    }
}
