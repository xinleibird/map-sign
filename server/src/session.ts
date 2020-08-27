import session, { SessionOptions, MemoryStore } from 'express-session';
import { CookieOptions } from 'express';
import env from './env';

env();

export const cookieOptions: CookieOptions = {
  secure: process.env.NODE_ENV !== 'development', // just https set this
  maxAge: process.env.NODE_ENV === 'development' ? 1000 * 60 * 2 : 1000 * 60 * 60 * 24 * 7,
};

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: true,
  cookie: cookieOptions,
  name: 'map_sign_session',
};
console.log(cookieOptions);
console.log(sessionOptions);

export default session(sessionOptions);
