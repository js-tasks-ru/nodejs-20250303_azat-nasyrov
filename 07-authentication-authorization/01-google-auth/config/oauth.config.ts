import { registerAs } from "@nestjs/config";

export default registerAs('oauth', () => ({
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || "google-client-id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret",
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
}));
