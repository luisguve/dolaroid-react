import * as reducers from './reducers';
import { createStore, combineReducers } from "redux";
import { loadContacts } from "./actions";
import loadDefaultContacts from "./load-contacts";
import { devToolsEnhancer } from 'redux-devtools-extension';

const store = createStore(combineReducers(reducers), devToolsEnhancer());

loadDefaultContacts().then(vCards => {
  if (vCards) {
    store.dispatch(loadContacts(vCards));
  }
});

export default store;