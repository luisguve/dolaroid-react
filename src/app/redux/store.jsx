import * as reducers from './reducers';
import { createStore, combineReducers } from "redux";
import { loadContacts } from "./actions";
import vcf from "vcf";
import vcfSample from "./vcfSample.vcf";
import { devToolsEnhancer } from 'redux-devtools-extension';

const store = createStore(combineReducers(reducers), devToolsEnhancer());

let vCards;
try {
  vCards = vcf.parse(vcfSample);
} catch(err) {
  console.log(err);
}

if (vCards) {
  store.dispatch(loadContacts(vCards));
}

export default store;