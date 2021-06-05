import React from "react";
import trianglify from "../assets/imgs/cool-background.png";

const Loader = () => {
  return(
    <div className="default-loader">
      <h1 className="p-5">Cargando...</h1>
    </div>
  );
};

const InlineLoader = () => {
  return (
    <div className="inline-loader">
      <h4>Cargando editor...</h4>
    </div>
  );
};

const style = {
  background: `url(${trianglify})`,
  backgroundSize: "cover",
  backgrundPosition: "center"
};

const StyledInlineLoader = () => {
  return (
    <div className="inline-loader" style={style}>
      <h4>Cargando editor...</h4>
    </div>
  );
};

export default Loader;

export {
  InlineLoader,
  StyledInlineLoader
};
