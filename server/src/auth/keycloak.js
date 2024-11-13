import dotenv from 'dotenv'
import Keycloak from 'keycloak-connect'
import KcAdminClient from '@keycloak/keycloak-admin-client'

dotenv.config()

const keycloakConfig = {
	'auth-server-url': process.env.KEYCLOAK_URL,
	realm: process.env.KEYCLOAK_REALM,
	resource: process.env.KEYCLOAK_CLIENT_ID,
	'bearer-only': true,
}
const credentials = {
	clientId: process.env.KEYCLOAK_CLIENT_ID,
	clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
	grantType: 'client_credentials',
}

const keycloak = new Keycloak({ scope: 'openid' }, keycloakConfig)

const kcAdminClient = new KcAdminClient({
	baseUrl: process.env.KEYCLOAK_URL,
	realmName: process.env.KEYCLOAK_REALM,
})

await kcAdminClient.auth(credentials)
setInterval(() => kcAdminClient.auth(credentials), 300 * 1000)

export { keycloak, kcAdminClient }
