import { search } from "../../assets/icons";
import React, { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { searchContact } from "../redux/actions";
import Contact from "./contact";

const Dashboard = props => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contactsToList);

  let contactsToList;
  if (contacts != null){
    contactsToList = contacts.map((vCard, idx) => {
      return <Contact key={idx} idx={idx} vCard={vCard} />
    });
  }

  const handleChangeSearch = e => {
    const query = e.target.value;
    dispatch(searchContact(query));
  };

  return (
    <div>
      <main className="my-1">
        <div className="d-flex align-items-center">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={handleChangeSearch}
          />
        </div>
        <div className="bg-light d-flex flex-wrap row">
          {contactsToList}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;