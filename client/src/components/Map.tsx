import 'mapbox-gl/dist/mapbox-gl.css';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  ContextViewStateChangeInfo,
  DragEvent,
  Layer,
  NavigationControl,
  PointerEvent,
  Source,
  ViewportProps,
} from 'react-map-gl';
import { Provider, RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { v5 as uuid } from 'uuid';
import { getAtlas } from '../api';
import { ICoordinates, ILocation, IOpenedTips, ISignEntry } from '../types';
import Sign from './Sign';
import { initEntries, updateAddedLocation } from './store/actions';
import reducers from './store/reducers';
import Tip from './Tip';
import MapSignForm from './MapSignForm';

const layer = {
  id: 'data',
  type: 'line',
  paint: {
    'line-color': '#c1303a',
  },
};

const Map = () => {
  const [viewport, setViewport] = useState<Partial<ViewportProps>>({
    latitude: 22.81669,
    longitude: 108.367287,
    zoom: 12,
    maxZoom: 15,
    minZoom: 2,
  });

  const [geoAtlas, setGeoAtlas] = useState(null as any);

  const dispatch = useDispatch();

  const currentMapInstance = useRef(null as any);

  const handleInitEntries = useCallback(() => {
    (async () => {
      const atlas = await getAtlas();
      setGeoAtlas(atlas);
    })();
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
    viewState.zoom = Math.round(viewState.zoom);
    setViewport(viewState);
  }, []);

  const { zoom } = viewport;
  return (
    <ReactMapGL
      onMouseUp={(e) => {
        console.log(e);
      }}
      ref={currentMapInstance}
      width="100vw"
      height="100vh"
      {...viewport}
      mapStyle="mapbox://styles/xinleibird/ckdommdsw55vc1jmsvl9xwkyv"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} // edit it at .env file in *client* root directory.
      doubleClickZoom={false}
      onDblClick={handleAddEntry}
      onViewStateChange={handleVisiable}
    >
      <Source type="geojson" data={geoAtlas}>
        <Layer {...layer} />
      </Source>
      <div style={{ position: 'absolute', left: 10, top: 10 }}>
        <NavigationControl showCompass={true} />
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
