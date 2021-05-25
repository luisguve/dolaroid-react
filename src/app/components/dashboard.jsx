import React from "react";
// Redux
import { useDispatch } from "react-redux";

const Dashboard = props => {
  const dispatch = useDispatch();
  const handleFile = e => {
    let input = event.target;

    let reader = new FileReader();
    reader.onload = () => {
      let data = reader.result;
      let contacts = vcf.parse(data);
      dispatch({
        type: actions.LOAD_CONTACTS,
        contacts: contacts
      });
    };
    reader.readAsText(input.files[0]);
  };
  return (
    <div>
      <main>Contacts</main>
      <input type='file' accept='text/plain' onChange={handleFile} />
    </div>
  );
};

export default Dashboard;