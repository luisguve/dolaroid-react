import React from "react";
import {
  profilePic2 as profilePic,
  edit,
  trash
} from "../../assets/icons";
// Toast utilities
import { useToasts } from "react-toast-notifications";
// Redux
import { useDispatch } from "react-redux";
import { getContact, deleteContact } from "../redux/actions";

const Contact = props => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  let telf = props.vCard.get("tel")._data;
  if (telf === undefined) {
    telf = props.vCard.get("tel")[1]._data;
  }
  let name = props.vCard.get("fn")._data;

  return (
    <div className="p-2 col-3">
      <div className="card p-1">
        <img className="card-img-top" alt="" src={profilePic} />
        <div className="card-body">
          <h6 className="card-title">{name}</h6>
          <p className="card-text">{telf}</p>
          <div className="d-flex justify-content-around">
            <button className="w-25 bg-transparent border-0 p-1"
            onClick={() => dispatch(getContact(props.idx))}>
              <img className="img-fluid" src={edit} />
            </button>
            <button className="w-25 bg-transparent border-0 p-1"
              onClick={() => {
                dispatch(deleteContact(props.idx));
                addToast(name + ' eliminado', { appearance: 'success' });
              }}>
              <img className="img-fluid" src={trash} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
