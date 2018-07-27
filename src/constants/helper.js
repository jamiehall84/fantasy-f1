export const WhoAmI = (season, user) => {
    return season.Players.find(p => {
        return p.uid === user.uid
    });
}