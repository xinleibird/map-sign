import React, { FC, useCallback, useMemo } from 'react';
import { Marker, MarkerProps } from 'react-map-gl';
import { useDispatch } from 'react-redux';
import { ISignEntry } from '../types';
import styles from './Map.module.css';
import { setOpenedTip } from './store/actions';

interface ISignProps {
  signEntry: ISignEntry;
  type?: 'yellow' | 'red';
  zoom: number;
}

const Sign: FC<Partial<MarkerProps> & ISignProps> = ({
  signEntry,
  type = 'yellow',
  zoom = 12,
  ...args
}) => {
  const { location, _id } = signEntry;
  const [longitude, latitude] = location.coordinates;

  const dispatch = useDispatch();

  const handleSetOpendTip = useCallback(
    (entryOpenedState) => {
      return () => {
        dispatch(setOpenedTip(entryOpenedState));
      };
    },
    [dispatch]
  );

  return useMemo(() => {
    return (
      <Marker
        longitude={longitude}
        latitude={latitude}
        offsetLeft={-zoom}
        offsetTop={-zoom * 2}
        {...args}
      >
        <div className={styles.sign} onClick={handleSetOpendTip({ [_id!]: true })}>
          <svg
            className={styles.signSVG}
            viewBox="0 0 24 24"
            style={{
              width: `${zoom * 2}px`,
              height: `${zoom * 2}px`,
              fill: `${type === 'yellow' ? '#e6891e' : '#ff2200'}`,
              stroke: 'white',
            }}
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </Marker>
    );
  }, [_id, args, handleSetOpendTip, latitude, longitude, type, zoom]);
};

export default Sign;
