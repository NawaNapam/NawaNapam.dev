export const nextEnv = {
  NA_SECRET: process.env.NEXTAUTH_SECRET,
  NA_URL: process.env.NEXTAUTH_URL,
};
export const isDev = process.env.NODE_ENV !== "production";

export const googleEnv = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
