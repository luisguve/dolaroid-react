import { contacts as reducer } from './reducers';
import { createStore } from "redux";
import { loadContacts } from "./actions";
import vcf from "vcf";
import vcfSample from "./vcfSample.vcf";

const store = createStore(reducer);

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