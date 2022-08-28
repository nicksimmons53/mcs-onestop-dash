module.exports = {
  reactStrictMode: true,
  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI,
    NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
    SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
    SESSION_COOKIE_LIFETIME: 10
  },
  images: {
    domains: ["s.gravatar.com"],
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
}
