import { PayloadModel } from "../models/payload.model";

export interface LoginResponseDTO extends PayloadModel {
    accessToken: string;
}
