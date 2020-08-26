import { Button, Card, Input, Spacer, Text, Textarea } from '@zeit-ui/react';
import React, { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { ISignEntry } from '../types';
import styles from './Map.module.css';
import placeholder from './res/placeholder.png';
import { addEntry, updateAddedLocation } from './store/actions';

const MapSignForm: FC<Partial<ISignEntry> & { editing?: boolean }> = ({
  location = { type: 'Point', coordinates: [0, 0] },
  children,
}) => {
  const dispatch = useDispatch();
  const { handleSubmit, register, errors } = useForm({ mode: 'onChange' });

  const handleClickClose = useCallback(() => {
    dispatch(updateAddedLocation(null));
  }, [dispatch]);

  return (
    <form
      className={styles.entryForm}
      onSubmit={handleSubmit((value) => {
        const fromForm = value as ISignEntry;
        const { image } = fromForm;

        let entry = { ...fromForm, location };

        if (!image) {
          entry = { ...entry, image: placeholder };
        }
        dispatch(addEntry(entry));
        dispatch(updateAddedLocation(null));
      })}
    >
      <Card width="300px">
        <div style={{ textAlign: 'right' }}>
          <Button size="mini" type="error" auto onClick={handleClickClose}>
            X
          </Button>
        </div>
        <Card.Content style={{ width: '260px' }}>
          <div style={{ textAlign: 'center' }}>
            <Text h3>添加标记</Text>
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
                value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
                message: '无效的 URL',
              },
            })}
          />
          <Text type="error" small>
            {errors.image?.message}
          </Text>
          <Spacer y={1} />
          <Textarea
            width="100%"
            placeholder="描述"
            name="description"
            ref={register({
              validate: (str) => {
                if (str.length > 512) {
                  return '描述最大接受512字符';
                }
              },
            })}
          />
          <Text type="error" small>
            {errors.description?.message}
          </Text>
        </Card.Content>
        <Card.Footer>
          <Button htmlType="submit" auto type="success" style={{ width: '50%' }}>
            添加
          </Button>
          <Button htmlType="reset" auto type="warning" style={{ width: '50%' }}>
            重置
          </Button>
        </Card.Footer>
        <Card.Footer>
          <Text span small type="success">{`${location!.coordinates[0]}`}</Text>
          <Text span small type="warning">{`${location!.coordinates[1]}`}</Text>
        </Card.Footer>
        {children}
      </Card>
    </form>
  );
};

export default MapSignForm;
