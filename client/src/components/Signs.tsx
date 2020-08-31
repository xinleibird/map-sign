import React from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { v5 as uuid } from 'uuid';
import { ISignEntry } from '../types';
import Sign from './Sign';

const Signs = ({ zoom }: { zoom: number }) => {
  const visibleEntries: ISignEntry[] = useSelector((state: RootStateOrAny) => {
    return state.signs.entries;
  });

  return (
    <>
      {visibleEntries.map((entry) => {
        const key = uuid(entry._id || '', '63d601b1-3193-475e-9d1e-ccb1fd077784');
        return <Sign signEntry={entry} zoom={zoom!} key={key} />;
      })}
    </>
  );
};

export default Signs;
