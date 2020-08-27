import { Button, Card, Link, useClickAway, User } from '@zeit-ui/react';
import { User as UserIcon, LogOut } from '@zeit-ui/react-icons';
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import githubPng from './res/github.png';
import userSVG from './res/user.svg';
import { setAppInitLoading } from './store/actions';

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

  const dispatch = useDispatch();

  const handleSignInLoading = useCallback(() => {
    dispatch(setAppInitLoading(true));
  }, [dispatch]);

  const handleSignOutLoading = useCallback(() => {
    dispatch(setAppInitLoading(true));
  }, [dispatch]);

  const { login, avatar_url, name } = userInfo;

  const hasLoginCard = useMemo(() => {
    return (
      <div ref={ref}>
        <Card>
          <User src={avatar_url} name={name}>
            <Link
              href={`${process.env.REACT_APP_SERVER_URL}/oauth/signout`}
              onClick={handleSignOutLoading}
            >
              退出登录
              <span style={{ marginLeft: '10px' }}>
                <LogOut size={12} />
              </span>
            </Link>
          </User>
        </Card>
      </div>
    );
  }, [avatar_url, handleSignOutLoading, name]);

  const notLoginCard = useMemo(() => {
    return (
      <div ref={ref}>
        <Link
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SERVER_URL}/oauth/redirect`}
          onClick={handleSignInLoading}
        >
          <Card>
            <User src={userSVG} name="请先登录">
              进行验证
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
  }, [handleSignInLoading]);

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
