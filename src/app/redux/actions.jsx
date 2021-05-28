// Load contacts from vCard in JSON format.
const LOAD_CONTACTS = "LOAD_CONTACTS";
// Update contact.
const EDIT_CONTACT = "EDIT_CONTACT";
// Get contact data to edit.
const GET_CONTACT = "GET_CONTACT";
// Delete contact.
const DELETE_CONTACT = "DELETE_CONTACT";
// Add contact.
const ADD_CONTACT = "ADD_CONTACT";
// Search contact.
const SEARCH_CONTACT = "SEARCH_CONTACT";
// Clean list of contacts
const CLEAN_CONTACTS = "CLEAN_CONTACTS";
// Show background settings
const LIST_BACKGROUNDS = "LIST_BACKGROUNDS";
// Update background
const CHANGE_BACKGROUND = "CHANGE_BACKGROUND";

const loadContacts = contacts => {
  return {
    type: LOAD_CONTACTS,
    contacts: contacts
  };
};
const editContact = (idx, info) => {
  return {
    type: EDIT_CONTACT,
    idx: idx,
    info: info
  };
};
const getContact = idx => {
  return {
    type: GET_CONTACT,
    idx: idx
  };
};
const deleteContact = idx => {
  return {
    type: DELETE_CONTACT,
    idx: idx
  };
};
const addContact = info => {
  return {
    type: ADD_CONTACT,
    info: info
  };
};
const searchContact = query => {
  return {
    type: SEARCH_CONTACT,
    query: query
  };
};
const cleanContacts = () => {
  return {
    type: CLEAN_CONTACTS
  };
};
const listBackgrounds = () => {
  return {
    type: LIST_BACKGROUNDS
  };
};
const changeBackground = () => {
  return {
    type: CHANGE_BACKGROUND
  };
};

export {
  LOAD_CONTACTS,
  loadContacts,
  EDIT_CONTACT,
  editContact,
  GET_CONTACT,
  getContact,
  DELETE_CONTACT,
  deleteContact,
  ADD_CONTACT,
  addContact,
  SEARCH_CONTACT,
  searchContact,
  CLEAN_CONTACTS,
  cleanContacts,
  LIST_BACKGROUNDS,
  listBackgrounds,
  CHANGE_BACKGROUND,
  changeBackground
};
