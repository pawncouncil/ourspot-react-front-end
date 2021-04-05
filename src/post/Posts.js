import React, { Component } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/spot.png";
import { Link } from "react-router-dom";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentDidMount = () => {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " Unknown";

          return (
            <div className="card col-md-4" key={i}>
              <div className="card-body" style={{ backgroundColor: "none" }}>
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt={post.title}
                  onError={(i) => (i.target.src = `${DefaultPost}`)}
                  className="img-thumbnail mb-3"
                  style={{
                    height: "200px",
                    width: "auto",
                  }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 100)}</p>
                <br />
                <p className="font-italic" style={{ opacity: "0.5" }}>
                  Posted by{" ~ "}
                  <Link to={`${posterId}`} style={{ color: "#ff9800" }}>
                    {posterName}
                  </Link>
                  {" ~ "}on {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-raised btn-outline-dark"
                >
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="container text-center">
        <h2 className="mt-5 mb-5">
          {!posts.length ? "Loading..." : "Recent Posts"}
        </h2>

        {this.renderPosts(posts)}
      </div>
    );
  }
}

export default Posts;
