import {AuthService} from "tcomad-oidc";
import * as Config from "../config";

export const authService = new AuthService({
    authority: Config.AUTHORITY,
    clientId: Config.CLIENT_ID,
    autoLogin: true
});