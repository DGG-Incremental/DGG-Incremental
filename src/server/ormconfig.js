console.log(process.env.DATABASE_URL);

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: ["lib/db/entity/**/*.ts"],
  migrations: ["lib/db/migration/**/*.ts"],
  subscribers: ["lib/db/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "lib/db/entity",
    migrationsDir: "lib/db/migration",
    subscribersDir: "lib/db/subscriber",
  },
};
