import React from "react";
import "../styles/Login.css";

function Login({ login }) {
  return (
    <div className="login-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className="form-control"
          placeholder="Your name goes here :)"
        ></input>
        <input
          className="form-control"
          placeholder="I hope you know the secret key XD"
        ></input>
        <div className="btn-group">
          <button
            type="proceed"
            className="btn btn-primary"
            onClick={() => {
              login();
            }}
          >
            let's go <i className="fa-solid fa-paper-plane"></i>
          </button>
          <button type="proceed" className="btn btn-warning">
            dummy <i className="fa-solid fa-star"></i>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
