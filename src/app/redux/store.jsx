import * as reducers from './reducers';
import { createStore, combineReducers } from "redux";
import { loadContacts } from "./actions";
import vcf from "vcf";
import vcfSample from "./contactos.vcf";
import contacts from "./contacts";
import { devToolsEnhancer } from 'redux-devtools-extension';

const store = createStore(combineReducers(reducers), devToolsEnhancer());

let vCards = [];
let loadedFrom;
if (!vcfSample) {
  // Create contacts
  contacts.map(contact => {
    let info = new vcf();
    info.set("fn", contact.fn);
    info.set("photo", contact.photo);
    info.set("n", contact.n);
    info.set("tel", contact.number);
    vCards.push(info);
  });
  loadedFrom = "Loaded contacts from js";
} else {
  try {
    vCards = vcf.parse(vcfSample);
  } catch(err) {
    console.log(err);
  }
  loadedFrom = "Loaded contacts from vCard";
}

if (vCards.length) {
  store.dispatch(loadContacts(vCards));
  console.log(loadedFrom);
}

export default store;