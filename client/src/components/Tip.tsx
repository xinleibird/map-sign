import {
  Avatar,
  Button,
  Card,
  Image,
  Link,
  Text,
  Tooltip,
  useClipboard,
} from '@zeit-ui/react';
import { Copy } from '@zeit-ui/react-icons';
import React, { FC, useCallback, useMemo } from 'react';
import { Popup, PopupProps } from 'react-map-gl';
import { useDispatch } from 'react-redux';
import { IOwner, ISignEntry } from '../types';
import Rating from './Rating';
import { setOpenedTip } from './store/actions';

interface ITipProps {
  signEntry: ISignEntry;
}

const Tip: FC<Partial<PopupProps> & ITipProps> = ({ signEntry, children, ...args }) => {
  const { location, title, _id, description, image, rating, owner } = signEntry;
  const [longitude, latitude] = location.coordinates;
  const { avatar_url, html_url, name } = owner as IOwner;

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
        longitude={longitude}
        latitude={latitude}
        closeButton={false}
        anchor="top"
        captureScroll={true}
        tipSize={15}
        sortByDepth={true}
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
              <Text h3>
                <Link
                  href={html_url}
                  style={{ position: 'absolute', top: '100px', left: '88px' }}
                >
                  <Tooltip text={name}>
                    <Avatar src={avatar_url} size="small" />
                  </Tooltip>
                </Link>
                {title}
              </Text>

              <Text h4 type="warning">
                <Rating num={rating || 0} />
              </Text>
              <Image src={image || ''} width={200} height={180} />
            </Card.Content>
            <Card.Content style={{ width: '257px' }}>
              <Text p small>
                {description}
              </Text>
            </Card.Content>
            <Card.Footer>
              <Text size={11} span type="success">{`${longitude}`}</Text>
              <span> - </span>
              <Text size={11} span type="warning">{`${latitude}`}</Text>
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
    avatar_url,
    children,
    copy,
    description,
    handleSetOpendTip,
    html_url,
    image,
    latitude,
    longitude,
    name,
    rating,
    title,
  ]);
};

export default Tip;
