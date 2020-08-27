import connect from 'connect-redis';
import { CookieOptions } from 'express';
import session, { SessionOptions } from 'express-session';
import redis from 'redis';

const RedisStore = connect(session);
const redisClient = redis.createClient();

export const cookieOptions: CookieOptions = {
  secure: process.env.NODE_ENV !== 'development', // just https set this
  maxAge: process.env.NODE_ENV === 'development' ? 1000 * 60 * 2 : 1000 * 60 * 60 * 24 * 7,
  sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
};

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: true,
  cookie: cookieOptions,
  name: 'map_sign_session',
  store: new RedisStore({ client: redisClient }),
};

export default session(sessionOptions);
