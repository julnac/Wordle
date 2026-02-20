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
    clientId: 'wordle-frontend-client', // ten sam client co frontend — tokeny mają aud=wordle-frontend-client
    bearerOnly: true, // Gateway tylko weryfikuje tokeny — logowanie obsługuje frontend
    serverUrl: process.env.KEYCLOAK_SERVER_URL || 'http://localhost:8080', // URL Twojego serwera Keycloak
    realm: 'wordle-app-realm', // Nazwa Twojego realmu w Keycloak
    credentials: {
        secret: 'jOYxA4ximKqr7o5k6JGXaxOZxtLStYnB' // Sekret klienta z Keycloak (jeśli Access Type to confidential)
    }
};

const keycloak = new Keycloak({ store: sessionConfig.store }, keycloakConfig);

module.exports = { sessionConfig, keycloak };