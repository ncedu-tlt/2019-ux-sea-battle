export const mainConfig = (): any => ({
    port: process.env.PORT_SERVER || 3000,
    dbUrl: process.env.DATABASE_URL,
    tokenSecretKey: process.env.TOKEN_SECRET_KEY
});
