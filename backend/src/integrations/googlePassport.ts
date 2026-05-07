import type { PassportStatic } from "passport";
import { Strategy as GoogleStrategy, type Profile } from "passport-google-oauth20";
import { config } from "../config.js";

export function initPassportGoogle(passport: PassportStatic) {
  if (!config.google.clientId || !config.google.clientSecret || !config.google.callbackUrl) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl
      },
      (_accessToken, _refreshToken, profile: Profile, done) => {
        done(null, profile);
      }
    )
  );
}

