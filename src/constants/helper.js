export const WhoAmI = (season, user) => {
    return season.Players.find(p =>  p.uid === user.uid);
}