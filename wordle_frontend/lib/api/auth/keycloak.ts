import Keycloak from 'keycloak-js';

// Upewnij się, że te wartości są poprawne dla Twojego klienta frontendowego w Keycloak
const keycloakConfig = {
    url: process.env.KEYCLOAK_SERVER_URL || 'http://localhost:8080', // URL serwera Keycloak (dostępny z przeglądarki)
    realm: 'wordle-app-realm',
    clientId: 'wordle-frontend-client'
};

let keycloakInstance: Keycloak | null = null;

if (typeof window !== "undefined") {
    keycloakInstance = new Keycloak(keycloakConfig);
}

export default keycloakInstance;