import { Modal } from '@geist-ui/react';
import React, { useCallback, useMemo } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setAppAlert } from './store/actions';

const AppAlert = () => {
  const alert = useSelector((state: RootStateOrAny) => {
    return state.app.alert;
  });

  const dispatch = useDispatch();

  const handlePassive = useCallback(
    ({ close }) => {
      dispatch(setAppAlert(null));
      close();
    },
    [dispatch]
  );
  const handleActive = useCallback(({ close }) => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SERVER_URL}/oauth/redirect`;
  }, []);

  return useMemo(() => {
    return (
      <Modal open={!!alert}>
        <Modal.Title>注意</Modal.Title>
        <Modal.Subtitle>{alert?.title}</Modal.Subtitle>
        <Modal.Content>
          <p>{alert?.description}</p>
        </Modal.Content>
        <Modal.Action onClick={handlePassive} passive>
          取消
        </Modal.Action>
        <Modal.Action onClick={alert?.action || handleActive}>{alert?.active}</Modal.Action>
      </Modal>
    );
  }, [alert, handleActive, handlePassive]);
};

export default AppAlert;
