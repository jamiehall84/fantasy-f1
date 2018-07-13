import { db } from './firebase';

// User API
export const doCreateUser = (id, username, email) =>
    db.ref(`users/${id}`).set({
        username,
        email,
    });
export const onceGetUsers = () =>
    db.ref('users').once('value');

// RACE DATA API
export const doCreateSeason = (year) =>
    db.ref(`seasons/${year}`).set({
        year
    });
export const getSeasons = () => 
    db.ref(`seasons`).once('value');

export const doCreateRace = (year, raceNumber, circuit, country, locality, raceName, date, time) =>
    db.ref(`seasons/${year}/races/${raceNumber}`).set({
        circuit,
        country,
        locality,
        raceName,
        date,
        time
    });
export const getRaces = (year) => 
    db.ref(`seasons/${year}/races`).once('value');

export const getRace = (year, raceNumber) =>
    db.ref(`seasons/${year}/races/${raceNumber}`).once('value');