import Keycloak from "keycloak-connect"
import dotenv from "dotenv"

dotenv.config()

const keycloakConfig = {
    "auth-server-url": process.env.KEYCLOAK_URL,
    "realm": process.env.KEYCLOAK_REALM,
    "resource": process.env.KEYCLOAK_CLIENT_ID,
    "bearer-only": true
}

const keycloak = new Keycloak({ scope: "openid" }, keycloakConfig)

export default keycloak