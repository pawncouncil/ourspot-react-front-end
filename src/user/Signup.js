import React, { Component } from "react";
import { signup } from "../auth";
import { Link } from "react-router-dom";
import "../App.css";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false,
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password,
    };
    console.log(user);
    signup(user).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          open: true,
        });
    });
  };

  signupForm = (name, email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">
          Name
          <input
            onChange={this.handleChange("name")}
            type="text"
            className="form-control"
            value={name}
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">
          Email
          <input
            onChange={this.handleChange("email")}
            type="email"
            className="form-control"
            value={email}
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">
          Password
          <input
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            value={password}
          />
        </label>
      </div>

      <button
        onClick={this.clickSubmit}
        className="btn btn-raised btn-outline-dark"
      >
        Submit
      </button>
    </form>
  );

  render() {
    const { name, email, password, error, open } = this.state;
    return (
      <div className="container text-center">
        <h2 className="mt-5 mb-5">Sign Up</h2>

        <div
          className="alert alert-warning"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div
          className="alert alert-info"
          style={{ display: open ? "" : "none" }}
        >
          Welcome to Our Spot! Please <Link to="/signin">Sign In</Link>!
        </div>

        {this.signupForm(name, email, password)}
      </div>
    );
  }
}

export default Signup;
