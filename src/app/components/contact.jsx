import React from "react";
import { profilePic } from "../../assets/icons";
// Redux
import { useDispatch } from "react-redux";
import { getContact, deleteContact } from "../redux/actions";

const Contact = props => {
  const dispatch = useDispatch();

  let telf = props.vCard.get("tel")._data;
  if (telf === undefined) {
    telf = props.vCard.get("tel")[1]._data;
  }

  return (
    <div className="card col-4 p-1">
      <img className="card-img-top" alt="" src={profilePic} />
      <div className="card-body">
        <h5 className="card-title">{props.vCard.get("fn")._data}</h5>
        <p className="card-text">{telf}</p>
        <div className="d-flex">
          <button
            className="btn btn-primary w-50"
            onClick={() => dispatch(getContact(props.idx))}
          >Editar</button>
          <button
            className="btn btn-danger w-50"
            onClick={() => dispatch(deleteContact(props.idx))}
          >Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
