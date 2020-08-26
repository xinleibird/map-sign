import { Loading, Page } from '@zeit-ui/react';
import React, { FC } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

const InitLoading: FC = () => {
  const isLoading = useSelector((state: RootStateOrAny) => {
    return state.app.isLoading;
  });

  return (
    <>
      {isLoading && (
        <Page>
          <Loading size="large">正在加载</Loading>
        </Page>
      )}
    </>
  );
};

export default InitLoading;
