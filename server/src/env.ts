import dotenv from 'dotenv';

const env = () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      dotenv.config({ path: './.development' });
    } else {
      dotenv.config();
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default env;
