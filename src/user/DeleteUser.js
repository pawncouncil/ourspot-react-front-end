import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { remove } from "./apiUser";
import { signout } from "../auth";

class DeleteUser extends Component {
  state = {
    redirect: false,
  };

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // signout user
        signout(() => console.log("user is deleted"));
        // redirect
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Do you want to delete your account?");
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className="btn btn-raised btn-outline-dark"
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
