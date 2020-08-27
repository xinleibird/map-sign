export interface IOpenedTips {
  [_id: string]: boolean;
}

export interface ICoordinates extends Array<number | number> {
  0: number;
  1: number;
}

export interface ILocation {
  type: 'Point';
  coordinates: ICoordinates;
}

export interface IOwner {
  login: string;
  avatar_url: string;
  name: string;
  html_url: string;
}

export interface ISignEntry {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  rating?: number;
  location: ILocation;
  owner?: IOwner;
}
