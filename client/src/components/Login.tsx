import React, { useMemo, useState, useRef } from 'react';
import userSVG from './res/user.svg';

import avatarImage from './res/avatar.png';

import { Card, User, Link, Button, useClickAway } from '@zeit-ui/react';
import Icon, { LogIn, LogOut, User as UserIcon } from '@zeit-ui/react-icons';

const Login = ({ isLogin }: { isLogin: boolean }) => {
  const [showCard, setShowCard] = useState(false);

  const ref = useRef(null as any);
  useClickAway(ref, () => {
    setShowCard(!showCard);
  });

  const loginCard = useMemo(() => {
    return (
      <div ref={ref}>
        <Card>
          <User src={avatarImage} name="辛磊">
            <User.Link href="https://github.com/xinleibird">@xinleibird</User.Link>
          </User>
        </Card>
      </div>
    );
  }, []);

  const logoutCard = useMemo(() => {
    return (
      <div ref={ref}>
        <Link
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SERVER_URL}/oauth/redirect`}
        >
          <Card>
            <User src={userSVG} name="点击登录"></User>
          </Card>
        </Link>
      </div>
    );
  }, []);

  const loginButton = useMemo(() => {
    return (
      <Button
        style={{ paddingLeft: '15px', paddingRight: '15px' }}
        auto
        onClick={() => {
          setShowCard(true);
        }}
      >
        <img src={avatarImage} alt="user" style={{ width: '24px', paddingTop: '8px' }} />
      </Button>
    );
  }, []);

  const logoutButton = useMemo(() => {
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

  if (isLogin) {
    return showCard ? loginCard : loginButton;
  } else {
    return showCard ? logoutCard : logoutButton;
  }
};

export default Login;
