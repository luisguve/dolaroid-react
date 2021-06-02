import React, { useState } from "react";
import { useSelector } from "react-redux";
// Background images
import { imgs } from "../../../assets";

const BackgroundChooser = props => {
  const currBgId = useSelector(state => state.settings.currentBackground.id);
  const [bgId, setBgId] = useState(currBgId);
  const previewBackground = () => {
    props.switchPreview("url("+imgs[bgId].url+")");
  };
  const cancel = () => {
    props.cancel()
  };
  const accept = () => {
    props.updateBackground({
      url: imgs[bgId].url,
      id: bgId
    });
  };
  let options = [];
  for (const id in imgs) {
    let checked = "";
    if (bgId == id) {
      checked = "checked";
    }
    options.push(
      <label className="col-6 col-md-4 px-0" key={id}>
        <input type="radio" checked={checked} value={id} name="background"
         onChange={e => setBgId(e.target.value)}/>
        <div className="content p-2">
          <img className="img-fluid sample" src={imgs[id].url} alt={imgs[id].name} />
          <p className="text-center m-0 pt-1"><em>{imgs[id].name}</em></p>
        </div>
      </label>
    );
  }
  return (
    <div className="background-chooser px-3 d-flex flex-column">
      {
      !props.inPreview &&
      <React.Fragment>
        <h1 className="col-12 text-secondary fs-4 fw-bold text-center my-3">
          Cambiar fondo de pantalla
        </h1>
        <div className="row mx-0 options">{options}</div>
      </React.Fragment>
      }
      <div className="py-2 d-flex justify-content-center">
        <button className="mx-2 btn btn-info" onClick={previewBackground}>
          {!props.inPreview ? "Vista previa" : "Volver"}
        </button>
        <button className="mx-2 btn btn-secondary" onClick={cancel}>
          Cancelar
        </button>
        <button className="mx-2 btn btn-primary" onClick={accept}>
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default BackgroundChooser;
