// import actions
import {
  LOAD_CONTACTS,
  EDIT_CONTACT,
  GET_CONTACT,
  DELETE_CONTACT,
  ADD_CONTACT,
  SEARCH_CONTACT
} from "./actions";

const DEFAULT_STATE = {
  contacts: [],
  currentContact: null,
  contactsToList: []
};

const contacts = (state = {}, action) => {
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
    return newState;

    case GET_CONTACT:
    if (action.idx < 0) {
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
    newContacts.concat(state.contact.slice(action.idx + 1));
    newState.contacts = newContacts;
    return newState;

    case ADD_CONTACT:
    // Append contact and sort list of contacts.
    newContacts = state.contacts
    .concat(action.info)
    .sort((a, b) => a.get("fn")._data.localeCompare(b.get("fn")._data));
    newState.contacts = newContacts;
    newState.contactsToList = newContacts;
    return newState;

    case SEARCH_CONTACT:
    // See if search input is a number
    // - If so, lookup contacts by phone number.
    // - Otherwise, lookup contacts by name
    let re = new RegExp("^"+action.query+".*");
    let cb;
    if (!isNaN(action.query)) {
      cb = info => {
        return re.test(info.get("cell"));
      };
    } else {
      cb = info => {
        return re.test(info.get("fn"));
      }
    }
    newContacts = state.contacts.filter(cb);
    newState.contactsToList = newContacts;
    return newState;

    default:
    return state;
  }
};

export { contacts };
