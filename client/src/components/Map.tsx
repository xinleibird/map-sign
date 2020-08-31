import { Avatar, Grid, Link, Spacer, Tooltip } from '@zeit-ui/react';
import 'element-theme-default';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { getCurrentUser } from '../api';
import { ICoordinates, ILocation, IOwner } from '../types';
import AppAlert from './AppAlert';
import LoadingLabel from './LoadingLabel';
import Login from './Login';
import avatarImage from './res/avatar.png';
import githubSVG from './res/github.png';
import Sign from './Sign';
import Signs from './Signs';
import {
  initEntries,
  setAppAlert,
  setAppUserInfo,
  updateAddedLocation,
} from './store/actions';
import reducers from './store/reducers';

const Map = () => {
  const [viewport, setViewport] = useState<Partial<ViewportProps>>({
    latitude: 22.828373068332063,
    longitude: 108.30307218045874,
    zoom: 12,
    maxZoom: 15,
    minZoom: 2,
  });

  const userInfo = useSelector((state: RootStateOrAny & { login: string }) => {
    return state.app.userInfo;
  });
  const { login } = userInfo as IOwner;

  const { zoom } = viewport;

  const dispatch = useDispatch();

  const currentMapInstance = useRef(null as any);

  const handleInitEntries = useCallback(() => {
    dispatch(initEntries());
  }, [dispatch]);

  const handleUserInfo = useCallback(() => {
    (async () => {
      const info = await getCurrentUser();
      dispatch(setAppUserInfo(info));
    })();
  }, [dispatch]);

  useEffect(() => {
    handleInitEntries();
    handleUserInfo();
  }, [handleInitEntries, handleUserInfo]);

  const addedCoordinates: ICoordinates = useSelector((state: RootStateOrAny) => {
    return state.signs.addedCoordinates;
  });

  const addedLocation: ILocation = {
    type: 'Point',
    coordinates: addedCoordinates,
  };

  const handleAddEntry = useCallback(
    (e: PointerEvent) => {
      if (!!login) {
        dispatch(updateAddedLocation(e.lngLat));
      } else {
        dispatch(
          setAppAlert(`
          为保证安全性，需要使用 Github
          账户对此应用进行授权，应用完全不保存您的信息，请放心使用。
        `)
        );
      }
    },
    [dispatch, login]
  );

  const handleDragAddEntry = useCallback(
    (e: DragEvent) => {
      dispatch(updateAddedLocation(e.lngLat));
    },
    [dispatch]
  );

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
        <LoadingLabel />

        <AppAlert />

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
            <Login />
          </Grid>
        </Grid.Container>

        <Signs zoom={zoom!} />

        {addedCoordinates.length === 2 && (
          <>
            <Sign
              signEntry={{
                title: '',
                location: addedLocation,
                _id: '',
                description: '',
                image: '',
                rating: 1,
                owner: userInfo,
              }}
              type="red"
              draggable={true}
              onDrag={handleDragAddEntry}
              zoom={zoom!}
              isNew
              isEditing
            />
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
