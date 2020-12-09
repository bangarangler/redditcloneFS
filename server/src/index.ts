import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import path from "path";
// Resolvers
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
// Constants
import { COOKIE_NAME, __prod__ } from "./constants";
import { MyContext } from "./types";
// Generated / Utils
// import { sendEmail } from "./utils/sendEmail";
// Config
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });
  // await conn.runMigrations();
  // await Post.delete({});
  const port = parseInt(process.env.PORT) || 4000;

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        //domain: "may need cust domain here"
        domain: __prod__ ? ".projects-bangarangler.dev" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET, // add ! must be in .env
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
    playground: {
      settings: {
        "request.credentials": "include",
      },
    },
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(port, () => {
    console.log(`server started on ${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
