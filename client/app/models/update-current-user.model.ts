import { UpdateCurrentUserDto } from "common/dto/update-current-user.dto";

export interface UpdateCurrentUserModel {
    user: UpdateCurrentUserDto;
    image: File;
}
