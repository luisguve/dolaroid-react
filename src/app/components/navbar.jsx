import * as icons from "../../assets/icons";
import React from "react";
import { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../redux/actions";
// Package for reading VCF text.
import vcf from "vcf";

const Navbar = props => {
  let contacts = useSelector(state => state.contacts);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleFileContents = data => {
    let contacts = vcf.parse(data);
    dispatch(actions.loadContacts(contacts));
    setShowModal(false);
  };
  const handleDownload = () => {
    if (!contacts.length) return;

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contacts.toString()));
    element.setAttribute('download', "contactos.vcf");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
  let downloadClass = "icon";
  if (!contacts.length) {
    downloadClass += " disabled";
  }
  return (
    <div className="container">
      <nav className="d-flex justify-content-between py-3">
        <div className="d-flex">
          <img
            alt=""
            className="icon me-3"
            title="Subir al chivo"
            src={icons.vcf}
            onClick={() => setShowModal(true)} />
          <img
            alt=""
            title="Descargar al chivo"
            className={downloadClass}
            src={icons.download}
            onClick={handleDownload}
          />
        </div>
        <div></div>
      </nav>
      {showModal && <Modal setFileContents={handleFileContents} hide={() => setShowModal(false)} />}
    </div>
  );
};

const Modal = props => {
  const [ headerText, setHeaderText ] = useState("Drag & Drop to Upload File");
  const [ dragAreaClass, setDragAreaClass ] = useState("drag-area");

  const readFile = file => {
    if (file.type !== "text/x-vcard") {
      alert("This is not a vCard file. Please upload a .VCF file.");
      setHeaderText("Drag & Drop to Upload File");
      setDragAreaClass("drag-area");
      return;
    }
    let reader = new FileReader();
    reader.onload = () => {
      props.setFileContents(reader.result);
    }
    reader.readAsText(file);
  };

  let inputElement;
  return (
    <div className="modal" onClick={() => props.hide()}>
      <div className={dragAreaClass}
      onDragOver={e => {
        e.preventDefault();
        setDragAreaClass("drag-area active");
        setHeaderText("Release to Upload File");
      }}
      onDragLeave={() => {
        setDragAreaClass("drag-area");
        setHeaderText("Drag & Drop to Upload File");
      }}
      onDrop={e => {
        e.preventDefault();
        readFile(e.dataTransfer.files[0]);
      }}
      onClick={e => e.stopPropagation()}>
        <img className="upload" alt="" src={icons.vcf} />
        <header>{headerText}</header>
        <span>OR</span>
        <button onClick={() => inputElement.click()}>Browse File</button>
        <input type="file"
          ref={input => inputElement = input } hidden
          onChange={e => {
            readFile(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
