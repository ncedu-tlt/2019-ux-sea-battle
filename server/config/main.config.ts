export const mainConfig = (): any => ({
    port: process.env.PORT_SERVER,
    dbUrl: process.env.DATABASE_URL,
    secretOrKey: process.env.TOKEN_SECRET_KEY
});
