import { CONVERSATION_STATES } from './config.js';

// Armazenar sessões em memória (MVP)
const sessions = new Map();

// Tempo de expiração de sessão (30 minutos)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export class SessionManager {
  static createSession(phoneNumber) {
    const sessionId = `session_${phoneNumber}_${Date.now()}`;
    const session = {
      phoneNumber,
      sessionId,
      state: CONVERSATION_STATES.INITIAL,
      data: {},
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };

    sessions.set(phoneNumber, session);
    return session;
  }

  static getSession(phoneNumber) {
    let session = sessions.get(phoneNumber);

    if (!session) {
      session = this.createSession(phoneNumber);
    }

    // Verificar se sessão expirou
    if (Date.now() - session.lastActivity > SESSION_TIMEOUT) {
      sessions.delete(phoneNumber);
      session = this.createSession(phoneNumber);
    }

    session.lastActivity = Date.now();
    return session;
  }

  static updateSession(phoneNumber, updates) {
    const session = this.getSession(phoneNumber);
    Object.assign(session, updates);
    sessions.set(phoneNumber, session);
    return session;
  }

  static setState(phoneNumber, newState) {
    const session = this.getSession(phoneNumber);
    session.state = newState;
    session.lastActivity = Date.now();
    sessions.set(phoneNumber, session);
    return session;
  }

  static setData(phoneNumber, key, value) {
    const session = this.getSession(phoneNumber);
    session.data[key] = value;
    session.lastActivity = Date.now();
    sessions.set(phoneNumber, session);
    return session;
  }

  static getData(phoneNumber, key) {
    const session = this.getSession(phoneNumber);
    return session.data[key];
  }

  static getAllData(phoneNumber) {
    const session = this.getSession(phoneNumber);
    return session.data;
  }

  static clearSession(phoneNumber) {
    sessions.delete(phoneNumber);
  }

  static getState(phoneNumber) {
    const session = this.getSession(phoneNumber);
    return session.state;
  }
}
