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
import MapSignForm from './MapSignForm';
import Sign from './Sign';
import { initEntries, updateAddedLocation } from './store/actions';
import reducers from './store/reducers';
import Tip from './Tip';
import avatar from './avatar.png';

const Map = () => {
  const [viewport, setViewport] = useState<Partial<ViewportProps>>({
    latitude: 22.828373068332063,
    longitude: 108.30307218045874,
    zoom: 12,
    maxZoom: 15,
    minZoom: 2,
  });

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
      dispatch(updateAddedLocation(e.lngLat));
    },
    [dispatch]
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

  const handleVisiable = useCallback((info: ContextViewStateChangeInfo) => {
    const { viewState } = info;
    setViewport(viewState);
  }, []);

  return (
    <ReactMapGL
      ref={currentMapInstance}
      width="100vw"
      height="100vh"
      {...viewport}
      mapStyle={process.env.REACT_APP_MAP_STYLE}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} // edit it at .env file in *client* root directory.
      doubleClickZoom={false}
      onDblClick={handleAddEntry}
      onViewStateChange={handleVisiable}
      attributionControl={false}
    >
      <div style={{ position: 'absolute', right: 12, top: 12 }}>
        <button
          title="github repo"
          style={{
            width: 32,
            height: 32,
            padding: 0,
            background: '#fff',
            border: 0,
            borderRadius: 20,
            outline: 0,
            fontSize: '0.75rem',
          }}
        >
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=https://xinleibird.me:20443/oauth/redirect`}
            style={{ textDecoration: 'none', fontSize: '0.75rem' }}
          >
            登录
          </a>
        </button>
      </div>
      <div style={{ position: 'absolute', left: 12, top: 12 }}>
        <NavigationControl showCompass={true} />
      </div>

      <div style={{ position: 'absolute', right: 12, bottom: 12 }}>
        <button
          title="github repo"
          style={{
            width: 32,
            height: 32,
            padding: 0,
            background: '#fff',
            border: 0,
            borderRadius: 20,
            outline: 0,
          }}
        >
          <a href="https://github.com/xinleibird/map-sign" target="blank">
            <img style={{ width: 32 }} src={avatar} alt="repo" draggable={false} />
          </a>
        </button>
      </div>

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
