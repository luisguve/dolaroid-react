import React from "react";
import trianglify from "../assets/imgs/cool-background.png";

const Loader = props => {
  return(
    <div className="default-loader">
      <h1 className="p-5">{props.label}</h1>
    </div>
  );
};

const InlineLoader = props => {
  return (
    <div className="inline-loader">
      <h4>{props.label}</h4>
    </div>
  );
};

const style = {
  background: `url(${trianglify})`,
  backgroundSize: "cover",
  backgrundPosition: "center"
};

const StyledInlineLoader = props => {
  return (
    <div className="inline-loader" style={style}>
      <h4>{props.label}</h4>
    </div>
  );
};

export default Loader;

export {
  InlineLoader,
  StyledInlineLoader
};
