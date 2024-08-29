import React, { Fragment } from "react";

import classes from "./Header.module.css";

const Header = ({place}) => {
  return (
    <Fragment>
      <header className={classes.header}>
        <h1>{place.name}</h1>
      </header>
      <div className={classes["main-image"]}>
        <img src={place.image} alt="A table full of delicious food!" />
      </div>
    </Fragment>
  );
};

export default Header;
