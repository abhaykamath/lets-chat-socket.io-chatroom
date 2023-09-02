import React from "react";
import "../styles/Header.css";

function Header({ loggedIn, logout }) {
  return (
    <h1>
      <div>
        Let's Talk <img src="./favicon.png"></img>
      </div>
      {loggedIn && (
        <button
          className="btn btn-danger"
          onClick={() => {
            logout();
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> leave
        </button>
      )}
    </h1>
  );
}

export default Header;
