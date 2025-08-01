export default ({ env }) => ({
  "user-permissions": {
    config: {
			jwt: {
				expiresIn: "1d",
			},
      jwtSecret: env("JWT_SECRET"),
    },
  },
  "auto-slug-manager": {
    enabled: true,
  },
});
