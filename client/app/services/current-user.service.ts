import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { CurrentUserDTO } from "./../../../common/dto/current-user.dto";
import { UpdateCurrentUserDto } from "./../../../common/dto/update-current-user.dto";

@Injectable({
    providedIn: "root"
})
export class CurrentUserService {
    private userSubject = new BehaviorSubject<CurrentUserDTO>(null);
    private user = this.userSubject.asObservable();

    constructor(private httpClient: HttpClient) {
        this.fetchCurrentUser();
    }

    fetchCurrentUser(): void {
        this.httpClient
            .get<CurrentUserDTO>("/api/users/current")
            .subscribe((u: CurrentUserDTO) => this.userSubject.next(u));
    }

    getCurrentUser(): Observable<CurrentUserDTO> {
        return this.user;
    }

    deleteCurrentUser(): void {
        this.userSubject.next(null);
    }

    updateCurrentUser(
        userBody: UpdateCurrentUserDto
    ): Observable<CurrentUserDTO> {
        return this.httpClient.patch<CurrentUserDTO>("/api/users", userBody);
    }
}
