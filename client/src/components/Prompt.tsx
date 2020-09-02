import React, { useEffect } from 'react';
import { useToasts } from '@geist-ui/react';
import { useSelector, RootStateOrAny } from 'react-redux';

const Prompt = () => {
  const [, setToats] = useToasts();
  const prompt = useSelector((state: RootStateOrAny) => {
    return state.app.prompt;
  });

  useEffect(() => {
    if (prompt) {
      setToats({ text: prompt });
    }
  }, [prompt]); // eslint-disable-line

  return <></>;
};

export default Prompt;
