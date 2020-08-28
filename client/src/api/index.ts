import { ISignEntry } from '../types';

export const listMapSignsFromDB = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/signs`, {
      credentials: 'include',
    });
    return res.json();
  } catch (error) {
    console.error(error.message);
    return { message: error.message, stack: error.stack };
  }
};

export const addMapSignToDB = async (param: ISignEntry) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/signs`, {
      method: 'POST',
      body: JSON.stringify(param),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    });
    return res.json();
  } catch (error) {
    console.error(error.message);
    return { message: error.message, stack: error.stack };
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/oauth/signin`, {
      credentials: 'include',
    });
    return res.json();
  } catch (error) {
    console.error(error.message);
    return { message: error.message, stack: error.stack };
  }
};
