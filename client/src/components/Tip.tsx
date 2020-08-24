import { Card, Image, Text, Tooltip, useClipboard, useToasts } from '@zeit-ui/react';
import { Copy } from '@zeit-ui/react-icons';
import React, { FC, useCallback, useMemo } from 'react';
import { Popup, PopupProps } from 'react-map-gl';
import { useDispatch } from 'react-redux';
import { ISignEntry } from '../types';
import styles from './Map.module.css';
import Rating from './Rating';
import { setOpenedTip } from './store/actions';

interface ITipProps {
  signEntry: ISignEntry;
}

const Tip: FC<Partial<PopupProps> & ITipProps> = ({ signEntry, children, ...args }) => {
  const { location, title, _id, description, image, rating } = signEntry;
  const [longitude, latitude] = location.coordinates;

  const [, setToast] = useToasts();
  const { copy } = useClipboard();

  const dispatch = useDispatch();

  const handleSetOpendTip = useCallback(
    (action) => {
      dispatch(setOpenedTip(action));
    },
    [dispatch]
  );

  return useMemo(() => {
    return (
      <Popup
        className={styles.tip}
        longitude={longitude}
        latitude={latitude}
        closeButton={true}
        closeOnClick={false}
        anchor="top"
        captureScroll={true}
        sortByDepth={true}
        onClose={() => {
          handleSetOpendTip({ [_id!]: false });
        }}
        {...args}
      >
        {children || (
          <Card width="300px" shadow={false}>
            <Card.Content style={{ width: '260px', textAlign: 'center' }}>
              <Text h3>{title}</Text>
              <Text h4 type="warning">
                <Rating num={rating || 0} />
              </Text>
              <Image
                src={image || ''}
                width={200}
                height={180}
                alt="景点图片"
                style={{ float: 'left' }}
              />
            </Card.Content>
            <Card.Content style={{ width: '260px' }}>
              <Text p small>
                {description}
              </Text>
            </Card.Content>
            <Card.Footer>
              <Text small span type="success">{`${longitude}`}</Text>
              <Text small span type="warning">{`${latitude}`}</Text>
              <Tooltip leaveDelay={100} text={'已拷贝'} trigger="click" type="dark">
                <Text
                  span
                  onClick={() => {
                    copy(`${longitude}, ${latitude}`);
                    setToast({ text: '文字已拷贝。' });
                  }}
                >
                  <Copy size={16} />
                </Text>
              </Tooltip>
            </Card.Footer>
          </Card>
        )}
      </Popup>
    );
  }, [
    _id,
    args,
    children,
    copy,
    description,
    handleSetOpendTip,
    image,
    latitude,
    longitude,
    rating,
    setToast,
    title,
  ]);
};

export default Tip;
