const session = require('express-session');
const Keycloak = require('keycloak-connect');

// Konfiguracja sesji (wymagane przez keycloak-connect)
const sessionConfig = {
    secret: 'bardzoTajnySekretDoSesji', // Zmień na silny sekret!
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore() // W produkcji użyj trwałego magazynu sesji, np. connect-redis
};

// Konfiguracja Keycloak
const keycloakConfig = {
    clientId: 'wordle-backend-client', // Client ID z Keycloak
    bearerOnly: false, // Ustaw na true, jeśli aplikacja tylko weryfikuje tokeny, a nie inicjuje logowania
    serverUrl: 'http://keycloak:8080/auth', // URL Twojego serwera Keycloak
    realm: 'wordle-app-realm', // Nazwa Twojego realmu w Keycloak
    credentials: {
        secret: 'Muy5DgOnyOaZHKwL0rK65RpjHO6xQSIP' // Sekret klienta z Keycloak (jeśli Access Type to confidential)
    }
};

const keycloak = new Keycloak({ store: sessionConfig.store }, keycloakConfig);

module.exports = { sessionConfig, keycloak };