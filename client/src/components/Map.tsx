import { Avatar, Grid, Link, Spacer, Tooltip, Modal, useModal } from '@zeit-ui/react';
import 'element-theme-default';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  ContextViewStateChangeInfo,
  DragEvent,
  NavigationControl,
  PointerEvent,
  ViewportProps,
} from 'react-map-gl';
import { Provider, RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { v5 as uuid } from 'uuid';
import { ICoordinates, ILocation, IOpenedTips, ISignEntry } from '../types';
import Login from './Login';
import MapSignForm from './MapSignForm';
import avatarImage from './res/avatar.png';
import githubSVG from './res/github.png';
import Sign from './Sign';
import { initEntries, updateAddedLocation } from './store/actions';
import reducers from './store/reducers';
import Tip from './Tip';

const Map = () => {
  const [viewport, setViewport] = useState<Partial<ViewportProps>>({
    latitude: 22.828373068332063,
    longitude: 108.30307218045874,
    zoom: 12,
    maxZoom: 15,
    minZoom: 2,
  });

  const [hasLogin, setLogin] = useState(false);

  const { setVisible: setLoginModalVisiable, bindings: modalBindings } = useModal();

  const { zoom } = viewport;

  const dispatch = useDispatch();

  const currentMapInstance = useRef(null as any);

  const handleInitEntries = useCallback(() => {
    dispatch(initEntries());
  }, [dispatch]);

  useEffect(() => {
    handleInitEntries();
  }, [handleInitEntries]);

  const visibleEntries: ISignEntry[] = useSelector((state: RootStateOrAny) => {
    return state.signs.entries;
  });

  const openedTips: IOpenedTips = useSelector((state: RootStateOrAny) => {
    return state.signs.openedTips;
  });

  const addedCoordinates: ICoordinates = useSelector((state: RootStateOrAny) => {
    return state.signs.addedCoordinates;
  });

  const addedLocation: ILocation = {
    type: 'Point',
    coordinates: addedCoordinates,
  };

  const handleAddEntry = useCallback(
    (e: PointerEvent) => {
      if (hasLogin) {
        dispatch(updateAddedLocation(e.lngLat));
      } else {
        setLoginModalVisiable(true);
      }
    },
    [dispatch, hasLogin, setLoginModalVisiable]
  );

  const handleDragAddEntry = useCallback(
    (e: DragEvent) => {
      dispatch(updateAddedLocation(e.lngLat));
    },
    [dispatch]
  );

  const handleCloseAddEntry = useCallback(() => {
    dispatch(updateAddedLocation(null));
  }, [dispatch]);

  const handleViewportChange = useCallback((info: ContextViewStateChangeInfo) => {
    const { viewState } = info;
    setViewport(viewState);
  }, []);

  return (
    <>
      <ReactMapGL
        ref={currentMapInstance}
        {...viewport}
        width="100vw"
        height="100vh"
        onViewStateChange={handleViewportChange}
        mapStyle={process.env.REACT_APP_MAP_STYLE}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} // edit it at .env file in *client* root directory.
        doubleClickZoom={false}
        onDblClick={handleAddEntry}
        attributionControl={false}
      >
        <Grid.Container justify="space-between">
          <Grid>
            <div>
              <NavigationControl showCompass={true} />
              <Spacer y={2} />
              <Link href="https://github.com/xinleibird/map-sign">
                <Tooltip text="欢迎推送" placement="right">
                  <Avatar size="small" src={githubSVG} />
                </Tooltip>
              </Link>
              <Spacer y={1} />
              <Link href="https://github.com/xinleibird">
                <Tooltip text="关于作者" placement="right">
                  <Avatar src={avatarImage} size="small" />
                </Tooltip>
              </Link>
            </div>
          </Grid>
          <Grid>
            <Login isLogin={hasLogin} />
          </Grid>
        </Grid.Container>

        <Modal {...modalBindings}>
          <Modal.Title>请先登录</Modal.Title>
          <Modal.Subtitle>添加标记需要登录</Modal.Subtitle>
          <Modal.Content>
            <p>
              为保证安全性，需要使用 Github
              账户对本站授权，本站不保存您的各种敏感信息，请放心使用。
            </p>
          </Modal.Content>
          <Modal.Action passive onClick={({ close }) => close()}>
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

        {visibleEntries.map((entry) => {
          const { _id } = entry;
          const key = uuid(entry._id || '', '63d601b1-3193-475e-9d1e-ccb1fd077784');

          return (
            <Fragment key={key + '_fragment'}>
              <Sign signEntry={entry} key={key + '_sign'} zoom={zoom!} />
              {openedTips[_id!] && <Tip signEntry={entry} key={key + '_tip'} />}
            </Fragment>
          );
        })}

        {addedCoordinates.length === 2 && (
          <>
            <Sign
              signEntry={{
                title: '',
                location: addedLocation,
              }}
              type="red"
              draggable={true}
              onDrag={handleDragAddEntry}
              zoom={zoom!}
            />
            <Tip
              signEntry={{
                title: '',
                location: addedLocation,
              }}
              onClose={handleCloseAddEntry}
            >
              <MapSignForm location={addedLocation} />
            </Tip>
          </>
        )}
      </ReactMapGL>
    </>
  );
};

const MapWrapper = () => {
  const store = createStore(reducers, applyMiddleware(thunk));
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  );
};

export default MapWrapper;
