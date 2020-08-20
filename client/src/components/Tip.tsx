import React, { FC, useCallback, useMemo } from 'react';
import { Popup, PopupProps } from 'react-map-gl';
import { useDispatch } from 'react-redux';
import { ISignEntry } from '../types';
import { setOpenedTip } from './store/actions';
import styles from './Map.module.css';

interface ITipProps {
  signEntry: ISignEntry;
}

const Tip: FC<Partial<PopupProps> & ITipProps> = ({ signEntry, children, ...args }) => {
  const { location, title, _id, description, image, rating } = signEntry;
  const [longitude, latitude] = location.coordinates;

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
        sortByDepth={true}
        onClose={() => {
          handleSetOpendTip({ [_id!]: false });
        }}
        {...args}
      >
        <div className={styles.tipContent}>
          {children || (
            <div className={styles.entryDesc}>
              <header>
                <h3>{title}</h3>
              </header>
              <main>
                {[...Array(rating)].map((t) => {
                  return '⭐';
                })}
                <div className={styles.imageContainer}>
                  <img src={image} alt="" />
                </div>
                <article>{description}</article>
              </main>
              <footer>
                <span>{`${longitude}, ${latitude}`}</span>
              </footer>
            </div>
          )}
        </div>
      </Popup>
    );
  }, [
    _id,
    args,
    children,
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
