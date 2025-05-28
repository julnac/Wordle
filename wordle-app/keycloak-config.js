import session from 'express-session';
import Keycloak from 'keycloak-connect';

// Konfiguracja sesji (wymagane przez keycloak-connect)
const sessionConfig = {
    secret: 'bardzoTajnySekretDoSesji', // Zmień na silny sekret!
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore() // W produkcji użyj trwałego magazynu sesji, np. connect-redis
};

// Konfiguracja Keycloak
const keycloakConfig = {
    clientId: 'myclient', // Client ID z Keycloak
    bearerOnly: false, // Ustaw na true, jeśli aplikacja tylko weryfikuje tokeny, a nie inicjuje logowania
    serverUrl: 'http://localhost:8080/auth', // URL Twojego serwera Keycloak
    realm: 'wordle-app-realm', // Nazwa Twojego realmu w Keycloak
    credentials: {
        secret: 'twoj-client-secret' // Sekret klienta z Keycloak (jeśli Access Type to confidential)
    }
};

const keycloak = new Keycloak({ store: sessionConfig.store }, keycloakConfig);

export { sessionConfig, keycloak };