export const mainConfig = (): any => ({
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL,
    tokenSecretKey: process.env.TOKEN_SECRET_KEY,
    tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || "1h"
});
