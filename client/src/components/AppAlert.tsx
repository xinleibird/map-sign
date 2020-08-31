import { Modal } from '@zeit-ui/react';
import React, { useCallback, useMemo } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setAppAlert } from './store/actions';

const AppAlert = () => {
  const alert = useSelector((state: RootStateOrAny) => {
    return state.app.alert;
  });

  const dispatch = useDispatch();

  const handleClick = useCallback(
    ({ close }) => {
      dispatch(setAppAlert(''));
      close();
    },
    [dispatch]
  );

  return useMemo(() => {
    return (
      <Modal open={!!alert}>
        <Modal.Title>注意</Modal.Title>
        <Modal.Subtitle>{alert}</Modal.Subtitle>
        <Modal.Action onClick={handleClick} passive>
          放弃使用
        </Modal.Action>
        <Modal.Action
          onClick={() => {
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SERVER_URL}/oauth/redirect`;
          }}
        >
          去 Github 授权
        </Modal.Action>
      </Modal>
    );
  }, [alert, handleClick]);
};

export default AppAlert;
