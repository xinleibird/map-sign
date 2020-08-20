import React, { FC } from 'react';
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
      <header>
        <h3>添加标记</h3>
      </header>
      <main>
        <input
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
        <div>{errors.title?.message}</div>
        <input
          placeholder="级别"
          name="rating"
          type="number"
          ref={register({
            pattern: {
              value: /^[1-5]$/,
              message: '数字 1 - 5',
            },
          })}
        />
        <div>{errors.rating?.message}</div>
        <input
          placeholder="图片 URL"
          name="image"
          ref={register({
            pattern: {
              value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
              message: '无效的 URL',
            },
          })}
        />
        <div>{errors.image?.message}</div>
        <textarea
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
        <div>{errors.description?.message}</div>
      </main>
      <footer>
        <span>{`${location!.coordinates[0]}, ${location!.coordinates[1]}`}</span>
        <br />
        <button type="submit">Confirm</button>
      </footer>
      {children}
    </form>
  );
};

export default MapSignForm;
