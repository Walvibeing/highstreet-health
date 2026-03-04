import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        };
      }

      if (Date.now() < (token.expires_at as number) * 1000) {
        return token;
      }

      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refresh_token as string,
          }),
        });

        const refreshed = await response.json();
        if (!response.ok) throw refreshed;

        return {
          ...token,
          access_token: refreshed.access_token,
          expires_at: Math.floor(Date.now() / 1000) + refreshed.expires_in,
          refresh_token: refreshed.refresh_token ?? token.refresh_token,
        };
      } catch {
        return { ...token, error: "RefreshTokenError" };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.access_token as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },
});
