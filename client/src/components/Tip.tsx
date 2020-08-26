import { Card, Button, Image, Text, Tooltip, useClipboard } from '@zeit-ui/react';
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
        closeButton={false}
        anchor="top"
        captureScroll={true}
        tipSize={15}
        {...args}
      >
        {children || (
          <Card width="300px" shadow={false}>
            <div style={{ textAlign: 'right' }}>
              <Button
                size="mini"
                type="error"
                auto
                onClick={(params) => {
                  handleSetOpendTip({ [_id!]: false });
                }}
              >
                X
              </Button>
            </div>
            <Card.Content style={{ width: '257px', textAlign: 'center' }}>
              <Text h3>{title}</Text>
              <Text h4 type="warning">
                <Rating num={rating || 0} />
              </Text>
              <Image src={image || ''} width={200} height={180} alt="标记图片" />
            </Card.Content>
            <Card.Content style={{ width: '257px' }}>
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
    title,
  ]);
};

export default Tip;
