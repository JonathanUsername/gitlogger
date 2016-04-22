import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';
import {hashHistory} from 'react-router';
import { persistState } from 'redux-devtools';
// import createSocketIoMiddleware from 'redux-socket.io';

import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import io from 'socket.io-client';


/**
 * Method to create stores based on a set of passed
 * reducers
 * @param initialState
 * @returns {*}
 */
export default function configureStore(initialState) {

  const socket = io('http://localhost:8000');

  const socketIoMiddleware = createSocketIoMiddleware(socket, '/server');

  const reduxRouterMiddleware = syncHistory(hashHistory);
  const middleware = applyMiddleware(thunk, reduxRouterMiddleware, socketIoMiddleware);

  const createStoreWithMiddleware = compose(
    middleware,
    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument(),
    // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
    persistState(getDebugSessionKey())
  );

  const store = createStoreWithMiddleware(createStore)(rootReducer, initialState);

  reduxRouterMiddleware.listenForReplays(store);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}


function createSocketIoMiddleware(socket, option = [], { eventName = 'action' } = {}) {

  return ({ dispatch }) => {

    // Wire socket.io to dispatch actions sent by the server.
    socket.on(eventName, dispatch);

    return next => action => {
      const { type } = action;

      if (type) {
        let emit = false;

        if (typeof option === 'string') {
          // String prefix
          emit = type.indexOf(option) === 0;
        } else if (typeof option === 'function') {
          // Test function
          emit = option(type, action);
        } else if (Array.isArray(option)) {
          // Array of types
          emit = option.some((item) => type.indexOf(item) === 0);
        }

        if (emit) {
          socket.emit(eventName, action);
        }
      }

      return next(action);
    };
  };
}

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}
