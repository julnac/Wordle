import Keycloak from 'keycloak-connect';
import session from 'express-session';

export const sessionConfig: session.SessionOptions;
export const keycloak: Keycloak;