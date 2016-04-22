import {combineReducers} from 'redux';
import {routeReducer} from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import events from './events';

export default combineReducers({
  events,
  routing: routeReducer,
  form: formReducer
});
