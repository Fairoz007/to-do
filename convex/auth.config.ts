import { defineAuthConfig } from "convex/server";

export default defineAuthConfig({
  providers: [
    {
      type: "clerk",
      issuer: "https://eternal-husky-0.clerk.accounts.dev",
      jwksUrl: "https://eternal-husky-0.clerk.accounts.dev/.well-known/jwks.json",
    },
  ],
});
