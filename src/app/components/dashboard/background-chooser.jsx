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
          <p className="text-center m-0 pt-1 small"><em>{imgs[id].name}</em></p>
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
      <div className="py-2 d-flex justify-content-center flex-wrap">
        <span className="px-2 w-100 w-sm-auto mb-2 mb-sm-0">
          <button className="btn btn-info w-100" onClick={previewBackground}>
            {!props.inPreview ? "Vista previa" : "Volver"}
          </button>
        </span>
        <span className="ps-2 pe-1 px-sm-2 w-50 w-sm-auto">
          <button className="btn btn-secondary w-100" onClick={cancel}>
            Cancelar
          </button>
        </span>
        <span className="ps-1 pe-2 px-sm-2 w-50 w-sm-auto">
          <button className="btn btn-primary w-100" onClick={accept}>
            Aceptar
          </button>
        </span>
      </div>
    </div>
  );
};

export default BackgroundChooser;
