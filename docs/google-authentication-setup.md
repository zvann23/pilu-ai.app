# Pilu email and Google authentication setup

Pilu requires its own Supabase project. Do not configure these settings in Phelo.

1. Create or select the Pilu project in Google Cloud Console.
2. Configure the OAuth consent screen with Pilu branding, Privacy Policy and Terms links.
3. Create a **Web application** OAuth client.
4. In Google, add authorized JavaScript origins: `http://localhost:3000` and `https://pilu-ai.vercel.app`. Add any verified custom production domain later.
5. In the Pilu Supabase dashboard, open **Authentication → Providers → Google** and copy the Supabase callback URL displayed there.
6. Add that Supabase callback URL to Google as the authorized redirect URI. It will look like `https://<pilu-project-ref>.supabase.co/auth/v1/callback`.
7. Add the Google client ID and secret in the **Google** provider settings in the Pilu Supabase dashboard; enable the provider.
8. In Supabase Auth URL configuration, set Site URL to `https://pilu-ai.vercel.app` when assigned. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/reset-password`
   - `https://pilu-ai.vercel.app/auth/callback`
   - `https://pilu-ai.vercel.app/auth/reset-password`
   - the matching preview deployment callback/reset URLs only when they are trusted and needed.
9. Add Vercel environment variables to the separate Pilu project:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<pilu-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<Pilu-browser-safe-key>
   NEXT_PUBLIC_SITE_URL=https://pilu-ai.vercel.app
   ```
10. Apply the Phase 12 migration to the Pilu project, enable email confirmation in Supabase Auth, then redeploy Pilu.

Google should use only the basic identity scopes: `openid`, email, and profile. Never commit the Google client secret, a Supabase service-role key, or any credentials.
