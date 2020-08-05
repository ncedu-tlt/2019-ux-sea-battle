import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { UpdateCurrentUserModel } from "../models/update-current-user.model";
import { CurrentUserDTO } from "./../../../common/dto/current-user.dto";

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
        updateUserModel: UpdateCurrentUserModel
    ): Observable<CurrentUserDTO> {
        const formData = new FormData();

        formData.append("image", updateUserModel.image);
        Object.keys(updateUserModel.user).forEach(key =>
            formData.append(key, updateUserModel.user[key])
        );

        return this.httpClient.patch<CurrentUserDTO>("/api/users", formData);
    }
}
