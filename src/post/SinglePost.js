import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/spot.png";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./Comment";
import "../App.css";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: [],
  };

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments,
        });
      }
    });
  };

  updateComments = (comments) => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Do you want to delete your post?");
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

    const { like, likes } = this.state;
    return (
      <div className="card-body">
        <div>
          <img
            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
            alt={post.title}
            onError={(i) => (i.target.src = `${DefaultPost}`)}
            className="img-thumbnail mb-3 postition-center"
            style={{
              height: "300px",
              width: "auto",
              objectFit: "cover",
            }}
          />
        </div>
        {like ? (
          <button
            className="btn btn-raised btn-sm"
            style={{
              color: "#50575e",
              backgroundColor: "#ff9800",
              boxShadow: "0 0 10px #ff9800",
              width: "30px",
              height: "30px",
              borderRadius: "15px",
              textAlign: "center",
            }}
            onClick={this.likeToggle}
          >
            <i className="fa fa-thumbs-up fa-sm" />{" "}
          </button>
        ) : (
          <button
            className="btn btn-raised btn-sm"
            style={{
              color: "#ff9800",
              backgroundColor: "#50575e",
              width: "30px",
              height: "30px",
              borderRadius: "15px",
              textAlign: "center",
            }}
            onClick={this.likeToggle}
          >
            <i className="fa fa-thumbs-up fa-sm " />{" "}
          </button>
        )}{" "}
        Likes {likes}
        <p className="card-text">{post.body}</p>
        <br />
        <p className="font-italic" style={{ opacity: "0.5" }}>
          Posted by{" ~ "}
          <Link to={`${posterId}`} style={{ color: "#ff9800" }}>
            {posterName}
          </Link>
          {" ~ "}on {new Date(post.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link to={`/`} className="btn btn-raised btn-outline-dark ">
            Back to posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-outline-dark ml-3"
                >
                  Edit Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className="btn btn-raised btn-outline-dark ml-3"
                >
                  Delete Post
                </button>
              </>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;
    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }
    return (
      <div className="container text-center">
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}

export default SinglePost;
