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
// SEASONS
export const doCreateSeason = (year) =>
    db.ref(`seasons/${year}`).set({
        year
    });
export const getSeasons = () => 
    db.ref(`seasons`).once('value');
export const getSeason = (year) => 
    db.ref(`seasons/${year}`).once('value');


// PLAYERS
export const newPlayerKey = (year) => db.ref().child(`seasons/${year}/Players`).push().key;

export const doCreatePlayer = (key,year, Name, Driver1, Driver2, email ) =>
    db.ref(`seasons/${year}/Players/${key}`).set({
        Name,
        Driver1,
        Driver2,
        email
    });
export const doGetPlayer = (year,player) =>
    db.ref(`seasons/${year}/Players/${player}`).once('value');

export const doUpdatePlayerDriver = (year, playerNumber, driverNumber, driver) =>
    db.ref(`seasons/${year}/Players/${playerNumber}`).child(driverNumber).update(driver);

// RACES
export const doCreateRace = (year, Circuit, date, raceName, round, time, season, url, QualifyingResults, Results, Points) =>
    db.ref(`seasons/${year}/races/${round}`).set({
        Circuit,
        date,
        raceName,
        round,
        time,
        season,
        url,
        QualifyingResults,
        Results,
        Points
    });

export const getRaces = (year) => 
    db.ref(`seasons/${year}/races`).once('value');

export const getRace = (year, raceNumber) =>
    db.ref(`seasons/${year}/races/${raceNumber}`).once('value');

// DRIVERS
export const doSetDrivers = (year, Drivers) =>
    db.ref(`seasons/${year}/Drivers`)
        .set(Drivers);

// QUALIFYING
export const doSetQualifying = (year, round, QualifyingResults) =>
    db.ref(`seasons/${year}/races/${round}/QualifyingResults`)
        .set(QualifyingResults);

// RESULTS
export const doSetResults = (year, round, Results) =>
    db.ref(`seasons/${year}/races/${round}/Results`)
        .set(Results);

// POINTS
export const doSetPoints = (year, round, Points) =>
    db.ref(`seasons/${year}/races/${round}/Points`)
        .set(Points);

