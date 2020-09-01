import { MapPin } from '@geist-ui/react-icons';
import React, { FC, useCallback, useMemo } from 'react';
import { Marker, MarkerProps, Popup } from 'react-map-gl';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { IOpenedTips, ISignEntry } from '../types';
import Content from './Content';
import { setOpenedTip } from './store/actions';

interface ISignProps {
  signEntry: ISignEntry;
  type?: 'yellow' | 'red';
  isNew?: boolean;
  isEditing?: boolean;
  zoom: number;
}

const Sign: FC<Partial<MarkerProps> & ISignProps> = ({
  signEntry,
  type = 'yellow',
  isNew = false,
  isEditing = false,
  zoom = 12,
  ...args
}) => {
  const { location, _id } = signEntry;
  const [longitude, latitude] = location.coordinates;

  const dispatch = useDispatch();

  const openedTips: IOpenedTips = useSelector((state: RootStateOrAny) => {
    return state.signs.openedTips;
  });

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
      <>
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

        {(openedTips[_id!] || isNew) && (
          <Popup
            longitude={longitude}
            latitude={latitude}
            closeButton={false}
            anchor="top"
            captureScroll={true}
            tipSize={15}
            sortByDepth={true}
            {...args}
          >
            <Content signEntry={signEntry} isNew={isNew} isEditing={isEditing} />
          </Popup>
        )}
      </>
    );
  }, [
    _id,
    args,
    handleSetOpendTip,
    isEditing,
    isNew,
    latitude,
    longitude,
    openedTips,
    signEntry,
    type,
    zoom,
  ]);
};

export default Sign;
