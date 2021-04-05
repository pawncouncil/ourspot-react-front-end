import React from "react";
import logo from "../images/spot.png";
import Posts from "../post/Posts";

const Home = () => (
  <div>
    <div className="jumbotron">
      <h2>Home</h2>
      <p className="lead">
        Welcome to{" "}
        <span>
          <img
            src={logo}
            width="25"
            height="25"
            class="d-inline-block "
            alt=""
          />
        </span>
        ur Spot!
      </p>
    </div>
    <div className="container">
      <Posts />
    </div>
  </div>
);
export default Home;
