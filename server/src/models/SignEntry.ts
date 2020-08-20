import { Document, model, Schema } from 'mongoose';

export interface ISignEntry {
  title: string;
  description?: string;
  image?: string;
  rating?: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

const SignEntry = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [
          {
            type: Number,
            required: true,
            max: 180,
            min: -180,
          },
          {
            type: Number,
            required: true,
            max: 90,
            min: -90,
          },
        ],
        required: true,
        validate: [
          (val: Array<number>) => {
            return val.length === 2;
          },
          '{PATH} Array length must be 2, Longitude and Latitude.',
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

export const MapSign = model<ISignEntry & Document>('MapSign', SignEntry);
