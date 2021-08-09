import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import logo from "../images/spot.png";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff9800" };
  else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
    <a className="navbar-brand" style={{ color: "rgb(238, 143, 3)" }} href="/">
      <img
        src={logo}
        width="30"
        height="30"
        class="d-inline-block align-top mr-1"
        alt=""
      />
      ur Spot
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mt-2 mt-lg-0 ml-auto">
        {isAuthenticated() && (
          <li className="nav-item">
            <Link
              className="nav-link"
              to={`/user/${isAuthenticated().user._id}`}
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
            >
              {`${isAuthenticated().user.name}'s `}
              <span>
                <img
                  src={logo}
                  width="15"
                  height="15"
                  className="d-inline-block mb-1"
                  alt=""
                />
              </span>
            </Link>
          </li>
        )}

        <li className="nav-item">
          <Link
            to={`/post/create`}
            style={isActive(history, `/post/create`)}
            className="nav-link"
          >
            Create Post
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" style={isActive(history, "/")} to="/">
            Posts
          </Link>
        </li>

        {/* <li className="nav-item">
          <Link
            to={`/findpeople`}
            style={isActive(history, `/findpeople`)}
            className="nav-link"
          >
            Find Spots
          </Link>
        </li> */}

        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/users")}
            to="/users"
          >
            Spots
          </Link>
        </li>

        {!isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signin")}
                to="/signin"
              >
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signup")}
                to="/signup"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}

        {isAuthenticated() && (
          <li className="nav-item mr-auto">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              onClick={() => signout(() => history.push("/"))}
            >
              Sign Out
            </span>
          </li>
        )}
      </ul>
    </div>
  </nav>
);

export default withRouter(Menu);
