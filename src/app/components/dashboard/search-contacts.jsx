import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchContact } from "../../redux/actions";

const SearchBar = props => {
  const contacts = useSelector(state => state.contacts.contactsToList);
  const dispatch = useDispatch();
  const handleSearch = e => {
    if (contacts == null) {
      return;
    }
    const query = e.target.value;
    dispatch(searchContact(query));
  };
  return (
    <div className="d-flex align-items-center search px-2 px-md-4">
      <span className="ps-md-2 pe-md-4 w-100">
        <input
          className="form-control"
          type="search"
          placeholder="Buscar contacto"
          aria-label="Buscar contacto"
          onChange={handleSearch}
        />
      </span>
    </div>
  );
};

export default SearchBar;