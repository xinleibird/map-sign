import { MapPin } from '@zeit-ui/react-icons';
import React, { FC, useCallback, useMemo } from 'react';
import { Marker, MarkerProps } from 'react-map-gl';
import { useDispatch } from 'react-redux';
import { ISignEntry } from '../types';
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
    const color = type === 'yellow' ? '#e6891e' : '#ff2200';
    const size = zoom * 2;
    return (
      <Marker
        longitude={longitude}
        latitude={latitude}
        offsetLeft={-zoom}
        offsetTop={-zoom * 2}
        {...args}
      >
        <div style={{ cursor: 'pointer' }} onClick={handleSetOpendTip({ [_id!]: true })}>
          <MapPin color={color} size={size} />
        </div>
      </Marker>
    );
  }, [_id, args, handleSetOpendTip, latitude, longitude, type, zoom]);
};

export default Sign;
