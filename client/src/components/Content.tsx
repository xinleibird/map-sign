import {
  Avatar,
  Button,
  Card,
  Image,
  Input,
  Link,
  Spacer,
  Text,
  Textarea,
  Tooltip,
  useClipboard,
  useToasts,
} from '@geist-ui/react';
import { Copy } from '@geist-ui/react-icons';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { IOwner, ISignEntry } from '../types';
import Rating from './Rating';
import {
  addEntry,
  deleteEntry,
  initEntries,
  setAppAlert,
  setOpenedTip,
  updateAddedLocation,
  updateEntry,
} from './store/actions';

interface IContentProps {
  signEntry: ISignEntry;
  isNew?: boolean;
  isEditing?: boolean;
}
const Content: FC<PropsWithChildren<IContentProps>> = ({
  signEntry,
  isNew = false,
  isEditing = false,
}) => {
  const { location, title, _id, description, image, rating, owner } = signEntry;
  const [longitude, latitude] = location.coordinates;
  const { avatar_url, html_url, name, login } = owner as IOwner;
  const { copy } = useClipboard();
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(isEditing);
  const [localNew, setNew] = useState(isNew);

  const handleSetOpendTip = useCallback(
    (action) => {
      dispatch(setOpenedTip(action));
    },
    [dispatch]
  );

  const isLoading = useSelector((state: RootStateOrAny) => {
    return state.app.isLoading;
  });

  const userInfo = useSelector((state: RootStateOrAny) => {
    return state.app.userInfo;
  });

  const [, setToast] = useToasts();

  const signShow = useMemo(() => {
    return (
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
        <Card.Content>
          <Text h4 style={{ textAlign: 'center' }}>
            {title}
          </Text>

          <Link href={html_url}>
            <Tooltip text={name}>
              <Avatar src={avatar_url} size="small" />
            </Tooltip>
          </Link>

          <Text h5 type="warning" style={{ textAlign: 'center' }}>
            <Rating num={rating || 0} />
          </Text>

          <Image src={image || ''} width={256} height={192} />
        </Card.Content>
        <Card.Content>
          <Text small>{description}</Text>
        </Card.Content>
        <Card.Footer>
          <Text size={11} span type="success">{`${longitude}`}</Text>
          <span> - </span>
          <Text size={11} span type="warning">{`${latitude}`}</Text>
          <Text
            span
            onClick={() => {
              copy(`${longitude}, ${latitude}`);
              setToast({ text: '已拷贝!' });
            }}
          >
            <Copy size={16} />
          </Text>
        </Card.Footer>
        <Card.Footer>
          <Button
            loading={isLoading}
            type="error"
            auto
            style={{ width: '50%' }}
            onClick={() => {
              dispatch(
                setAppAlert({
                  title: '正在删除标记',
                  description: '您正在删除标记，此操作不可逆！确认删除吗？',
                  active: '确认删除',
                  action: async () => {
                    dispatch(deleteEntry(signEntry));
                    dispatch(setAppAlert(null));
                  },
                })
              );
            }}
            disabled={userInfo.login !== login}
          >
            删除
          </Button>
          <Button
            type="warning"
            auto
            style={{ width: '50%' }}
            onClick={() => {
              setEditing(true);
            }}
            disabled={userInfo.login !== login}
          >
            编辑
          </Button>
        </Card.Footer>
      </Card>
    );
  }, [
    _id,
    avatar_url,
    copy,
    description,
    dispatch,
    handleSetOpendTip,
    html_url,
    image,
    isLoading,
    latitude,
    login,
    longitude,
    name,
    rating,
    setToast,
    signEntry,
    title,
    userInfo.login,
  ]);

  const { handleSubmit, register, errors } = useForm({ mode: 'onChange' });
  const addedCoordinates = useSelector((state: RootStateOrAny) => {
    return state.signs.addedCoordinates;
  });

  const handleClickClose = useCallback(() => {
    dispatch(setOpenedTip({}));
    dispatch(updateAddedLocation([]));
  }, [dispatch]);

  useEffect(() => {
    dispatch(initEntries());
  }, [dispatch]);

  const signForm = useMemo(() => {
    return (
      <form
        onSubmit={handleSubmit((value) => {
          const formValue = value as ISignEntry;
          const { image, rating } = formValue;

          let entry: ISignEntry = {
            ...formValue,
          };

          if (!image) {
            entry = { ...entry, image: '' };
          }

          if (!rating) {
            entry = { ...entry, rating: 1 };
          }

          entry = { ...entry, location, owner };

          if (localNew && editing) {
            entry = { ...entry, location: { type: 'Point', coordinates: addedCoordinates } };

            dispatch(addEntry(entry));
            setNew(false);
          }

          if (!localNew && editing) {
            entry = { ...entry, _id };

            dispatch(updateEntry(entry));
          }
        })}
      >
        <Card width="300px">
          <div style={{ textAlign: 'right' }}>
            <Button size="mini" type="error" auto onClick={handleClickClose}>
              X
            </Button>
          </div>
          <Card.Content>
            <div style={{ textAlign: 'center' }}>
              <Text h4>{isNew ? '新建标记' : '编辑标记'}</Text>
            </div>
            <Input
              width="100%"
              clearable
              placeholder="标题"
              name="title"
              ref={register({
                required: '标题不能为空',
                pattern: {
                  value: /(\p{Unified_Ideograph}|[a-zA-Z0-9_ ])/u,
                  message: '仅接收字符数字空格和下划线',
                },
                validate: (str) => {
                  if (str.length > 48) {
                    return `标题最大接受48字符`;
                  }
                },
              })}
              initialValue={title}
            />
            <Text type="error" small>
              {errors.title?.message}
            </Text>
            <Spacer y={1} />
            <Input
              width="100%"
              clearable
              placeholder="级别"
              name="rating"
              ref={register({
                pattern: {
                  value: /^[1-5]$/,
                  message: '数字 1 - 5',
                },
              })}
              initialValue={`${isNew ? '' : rating}`}
            />
            <Text type="error" small>
              {errors.rating?.message}
            </Text>
            <Spacer y={1} />
            <Input
              width="100%"
              clearable
              placeholder="图片地址"
              name="image"
              ref={register({
                pattern: {
                  value: /https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
                  message: '仅接受 https 协议的 URL',
                },
              })}
              initialValue={image}
            />
            <Text type="error" small>
              {errors.image?.message}
            </Text>
            <Spacer y={1} />
            <Textarea
              width="100%"
              rows={6}
              placeholder="描述"
              name="description"
              ref={register({
                validate: (str) => {
                  if (str.length > 512) {
                    return '描述最大接受512字符';
                  }
                },
              })}
              initialValue={description}
            />
            <Text type="error" small>
              {errors.description?.message}
            </Text>
          </Card.Content>
          <Card.Footer>
            <Button htmlType="reset" auto type="warning" style={{ width: '50%' }}>
              重置
            </Button>
            <Button
              loading={isLoading}
              htmlType="submit"
              auto
              type="success"
              style={{ width: '50%' }}
            >
              {isNew ? '新建' : '更新'}
            </Button>
          </Card.Footer>
          <Card.Footer>
            <Text size={11} span type="success">
              {isNew ? `${addedCoordinates[0]}` : longitude}
            </Text>
            <Text size={11} span type="warning">
              {isNew ? `${addedCoordinates[1]}` : latitude}
            </Text>
          </Card.Footer>
        </Card>
      </form>
    );
  }, [
    _id,
    addedCoordinates,
    description,
    dispatch,
    editing,
    errors.description,
    errors.image,
    errors.rating,
    errors.title,
    handleClickClose,
    handleSubmit,
    image,
    isLoading,
    isNew,
    latitude,
    localNew,
    location,
    longitude,
    owner,
    rating,
    register,
    title,
  ]);

  return editing ? signForm : signShow;
};

export default Content;
