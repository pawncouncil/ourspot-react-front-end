import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import "../App.css";

class Comment extends Component {
  state = {
    text: "",
    error: "",
  };

  handleChange = (event) => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Please leave a comment between 1 and 150 characters.",
      });
      return false;
    }
    return true;
  };

  addComment = (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: "Please signin to leave a comment" });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          // dispatch fresh list of coments to parent (SinglePost)
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirmed = (comment) => {
    let answer = window.confirm("Do you want to delete your comment?");
    if (answer) {
      this.deleteComment(comment);
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        <h2 className="mt-5 mb-5 text-muted">Leave a comment</h2>

        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.text}
              className="form-control"
              placeholder="Leave a comment!"
            />
            <button className="btn btn-raised btn-outline-dark mt-2">
              Post Comment
            </button>
          </div>
        </form>

        <div
          className="alert alert-warning"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div className="col-md-12 p-0">
          <h5 className="text-muted">{comments.length} Comments</h5>
          <hr className="col-md-12 p-0" />

          {comments.map((comment, i) => (
            <div key={i}>
              <div className="mb-2">
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{ borderRadius: "50%", border: "1px solid black" }}
                    className="float-left"
                    height="50px"
                    width="50px"
                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    alt={comment.postedBy.name}
                  />
                </Link>
                <div>
                  <p className="lead text-dark">{comment.text}</p>
                  <p
                    className="font-italic position-center "
                    style={{ fontSize: "10px" }}
                  >
                    Posted by{" ~ "}
                    <Link
                      to={`/user/${comment.postedBy._id}`}
                      style={{ color: "#ff9800" }}
                    >
                      {comment.postedBy.name}
                    </Link>
                    {" ~ "}on {new Date(comment.created).toDateString()}
                    {isAuthenticated().user &&
                      isAuthenticated().user._id === comment.postedBy._id && (
                        <button
                          className="btn btn-raised btn-sm text-dark float-right"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "15px",
                          }}
                          onClick={() => this.deleteConfirmed(comment)}
                        >
                          <i className="far fa-trash-alt fa-sm" />
                        </button>
                      )}
                  </p>
                </div>
              </div>
              <hr className="col-md-12 p-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Comment;
