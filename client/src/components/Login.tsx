import { Button, Card, Link, useClickAway, User } from '@zeit-ui/react';
import { User as UserIcon } from '@zeit-ui/react-icons';
import React, { useMemo, useRef, useState } from 'react';
import githubPng from './res/github.png';
import userSVG from './res/user.svg';
import { useSelector, RootStateOrAny } from 'react-redux';

const Login = () => {
  const [showCard, setShowCard] = useState(false);

  const ref = useRef(null as any);
  useClickAway(ref, () => {
    setShowCard(!showCard);
  });

  const userInfo = useSelector(
    (
      state: RootStateOrAny & {
        login: string;
        avatar_url: string;
        name: string;
        html_url: string;
      }
    ) => {
      return state.app.userInfo;
    }
  );

  const { login, avatar_url, name, html_url } = userInfo;

  const hasLoginCard = useMemo(() => {
    return (
      <div ref={ref}>
        <Card>
          <User src={avatar_url} name={name}>
            <User.Link href={html_url}>{login}</User.Link>
          </User>
        </Card>
      </div>
    );
  }, [avatar_url, html_url, login, name]);

  const notLoginCard = useMemo(() => {
    return (
      <div ref={ref}>
        <Link
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SERVER_URL}/oauth/redirect`}
        >
          <Card>
            <User src={userSVG} name="请先登录">
              github
              <img
                src={githubPng}
                alt="github"
                style={{ width: '12px', marginLeft: '10px' }}
              />
            </User>
          </Card>
        </Link>
      </div>
    );
  }, []);

  const hasLoginButton = useMemo(() => {
    return (
      <Button
        style={{ paddingLeft: '15px', paddingRight: '15px' }}
        auto
        onClick={() => {
          setShowCard(true);
        }}
      >
        <img src={avatar_url} alt="user" style={{ width: '24px', paddingTop: '8px' }} />
      </Button>
    );
  }, [avatar_url]);

  const notLoginButton = useMemo(() => {
    return (
      <Button
        style={{ paddingLeft: '15px', paddingRight: '15px' }}
        auto
        iconRight={<UserIcon />}
        onClick={() => {
          setShowCard(true);
        }}
      />
    );
  }, []);

  if (!!login) {
    return showCard ? hasLoginCard : hasLoginButton;
  } else {
    return showCard ? notLoginCard : notLoginButton;
  }
};

export default Login;
