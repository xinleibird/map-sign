import { Button, Card, Link, useClickAway, User } from '@zeit-ui/react';
import { User as UserIcon } from '@zeit-ui/react-icons';
import React, { useMemo, useRef, useState } from 'react';
import avatarImage from './res/avatar.png';
import githubPng from './res/github.png';
import userSVG from './res/user.svg';

const Login = ({ isLogin }: { isLogin: boolean }) => {
  const [showCard, setShowCard] = useState(false);

  const ref = useRef(null as any);
  useClickAway(ref, () => {
    setShowCard(!showCard);
  });

  const hasLoginCard = useMemo(() => {
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
        <img src={avatarImage} alt="user" style={{ width: '24px', paddingTop: '8px' }} />
      </Button>
    );
  }, []);

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

  if (isLogin) {
    return showCard ? hasLoginCard : hasLoginButton;
  } else {
    return showCard ? notLoginCard : notLoginButton;
  }
};

export default Login;
