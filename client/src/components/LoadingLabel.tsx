import { Loading, Page } from '@zeit-ui/react';
import React, { FC } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

const LoadingLabel: FC = () => {
  const isLoading = useSelector((state: RootStateOrAny) => {
    return state.app.isLoading;
  });

  return (
    <>
      {isLoading && (
        <Page>
          <Loading size="large" type="warning" />
        </Page>
      )}
    </>
  );
};

export default LoadingLabel;
