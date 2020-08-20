import { ISignEntry } from '../types';

export const listMapSignsFromDB = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/signs`);
    return res.json();
  } catch (error) {
    console.error(error.message);
  }
};

export const addMapSignToDB = async (param: ISignEntry) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/signs`, {
      method: 'POST',
      body: JSON.stringify(param),
      headers: {
        'content-type': 'application/json',
      },
    });
    return res.json();
  } catch (error) {
    console.error(error.message);
  }
};

export const getAtlas = async () => {
  try {
    const atlas = await fetch('https://geo.datav.aliyun.com/areas_v2/bound/450100.json');
    return atlas.json();
  } catch (error) {
    console.error(error.message);
  }
};
