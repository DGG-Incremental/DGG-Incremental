module.exports = {
   "type": "postgres",
   "host": "localhost",
   "port": 5432,
   "username": process.env.DATABASE_USER || "dgg",
   "password": "password",
   "database": "dgg-clicker-server",
   "synchronize": true,
   "logging": false,
   "entities": [
      "lib/db/entity/**/*.ts"
   ],
   "migrations": [
      "lib/db/migration/**/*.ts"
   ],
   "subscribers": [
      "lib/db/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "lib/db/entity",
      "migrationsDir": "lib/db/migration",
      "subscribersDir": "lib/db/subscriber"
   }
}