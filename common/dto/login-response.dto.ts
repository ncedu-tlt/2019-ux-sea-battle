import { TokenPayloadModel } from "../models/token-payload.model";

export interface LoginResponseDTO extends TokenPayloadModel {
    accessToken: string;
}
