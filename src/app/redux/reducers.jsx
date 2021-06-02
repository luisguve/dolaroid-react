// import actions
import {
  LOAD_CONTACTS,
  EDIT_CONTACT,
  GET_CONTACT,
  DELETE_CONTACT,
  ADD_CONTACT,
  SEARCH_CONTACT,
  CLEAN_CONTACTS,
  LIST_BACKGROUNDS,
  CHANGE_BACKGROUND
} from "./actions";
import { imgs } from "../../assets";

const DEFAULT_STATE = {
  contacts: [],
  currentContact: null,
  contactsToList: null
};

const contacts = (state = DEFAULT_STATE, action) => {
  // Clone state to set it's properties.
  let newState = Object.assign({}, state);
  let newContacts;

  switch(action.type) {

    case LOAD_CONTACTS:
    newContacts = action.contacts
    .sort((a, b) => a.get("fn")._data.localeCompare(b.get("fn")._data));
    newState = DEFAULT_STATE;
    newState.contacts = newContacts;
    newState.contactsToList = newContacts;
    return newState;

    case EDIT_CONTACT:
    // Copy contacts in order to return a brand new list of contacts.
    newContacts = [...state.contacts];
    // Edit the contact at the given idx.
    newContacts[action.idx] = action.info;
    newState.contacts = newContacts;
    newState.contactsToList = newContacts;
    newState.currentContact = null;
    console.log("contacto actualizado. se ve mejor asi");
    return newState;

    case GET_CONTACT:
    if ((action.idx < 0) || (action.idx >= state.contacts.length)) {
      newState.currentContact = null;
      return newState;
    }
    // Retrieve the info of contact at the given idx.
    let info = state.contacts[action.idx];
    info.idx = action.idx;
    newState.currentContact = info;
    return newState;

    case DELETE_CONTACT:
    // Remove contact at the given idx.
    newContacts = state.contacts.slice(0, action.idx);
    newContacts.push(...state.contacts.slice(action.idx + 1));
    newState.contacts = newContacts;
    newState.contactsToList = newContacts;
    if (!newContacts.length) {
      newState.contactsToList = null;
    }
    if (newState.currentContact) {
      if (newState.currentContact.idx == action.idx) {
        newState.currentContact = null;
      } else if (action.idx < newState.currentContact.idx) {
        // Fix index if the deleted contact was before the current contact.
        newState.currentContact.idx--;
      }
    }
    console.log("contacto eliminado mano");
    return newState;

    case ADD_CONTACT:
    // Append contact and sort list of contacts.
    newContacts = state.contacts
    .concat(action.info)
    .sort((a, b) => a.get("fn")._data.localeCompare(b.get("fn")._data));
    newState.contacts = newContacts;
    newState.contactsToList = newContacts;
    console.log("todo fino");
    return newState;

    case SEARCH_CONTACT:
    // Empty query? reset contacts to list.
    if (!action.query) {
      newState.contactsToList = newState.contacts;
      return newState;
    }
    // See if search input is a number
    // - If so, lookup contacts by phone number.
    // - Otherwise, lookup contacts by name
    let re = new RegExp("^"+action.query+".*?", "i");
    let cb;
    if (!isNaN(action.query)) {
      cb = info => {
        let tel = info.get("tel");
        if (Array.isArray(tel)) {
          tel = tel[1];
        }
        return re.test(tel._data);
      };
    } else {
      cb = info => {
        return re.test(info.get("fn")._data);
      }
    }
    newContacts = state.contacts.filter(cb);
    newState.contactsToList = newContacts;
    return newState;

    case CLEAN_CONTACTS:
    newState.contacts = [];
    newState.currentContact = null;
    newState.contactsToList = null;
    return newState;

    default:
    return state;
  }
};

const defaultSettings = {
  listBackgrounds: false,
  currentBackground: {
    url: `url(${imgs["basicBg1"].url})`,
    id: "basicBg1"
  }
};

const settings = (state = defaultSettings, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case LIST_BACKGROUNDS:
    newState.listBackgrounds = !state.listBackgrounds;
    return newState;

    case CHANGE_BACKGROUND:
    newState.currentBackground = action.background;
    newState.listBackgrounds = false;
    return newState;

    default:
    return state;
  }
};

export { contacts, settings };
