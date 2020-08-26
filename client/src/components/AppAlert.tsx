import React, { useMemo, useCallback } from 'react';
import { Modal } from '@zeit-ui/react';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
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
        <Modal.Action onClick={handleClick}>知道了</Modal.Action>
      </Modal>
    );
  }, [alert, handleClick]);
};

export default AppAlert;
