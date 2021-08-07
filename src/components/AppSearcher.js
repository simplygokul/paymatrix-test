import React, { Component } from "react";
import axios from "axios";
import "./AppSearcher.sass";
import SearchForm from "./SearchForm/SearchForm";
import ResultCard from "./ResultCard/ResultCard";

export default class AppSearcher extends Component {
  state = {
    cached: [],
    results: [],
    toggleElementId: null,
  };

  componentDidMount() {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((posts) => posts.data)
      .then((posts) => {
        axios
          .get("https://jsonplaceholder.typicode.com/users")
          .then((users) => users.data)
          .then((users) => {
            posts.map((post) => {
              const user = users.find((user) => user.id === post.userId);
              post.username = user.name;
              return post;
            });

            this.setState({
              searchValue: "",
              cached: posts,
              results: posts,
            });
          })
          .catch((err) => {
            console.log(`Can't load users: ${err}`);
          });
      })
      .catch((err) => {
        console.log(`Can't load posts: ${err}`);
      });
  }

  setResults = (value) => {
    var filtered = this.state.cached;
    if (value.length > 0) {
      let regex = new RegExp(
        value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
        "ig"
      );

      filtered = this.state.cached.filter((post) => {
        return (
          regex.test(post.title) ||
          regex.test(post.username) ||
          regex.test(post.body)
        );
      });
    }
    this.setState({ ...this.state, results: filtered });
  };
  toggleCard = (id) => {
    const { toggleElementId } = this.state;
    if (toggleElementId === id) {
      this.setState({ toggleElementId: null });
    } else {
      this.setState({ toggleElementId: id });
    }
  };
  deleteTask = (id) => {
    const { results } = this.state;
    const fltrdTsks = results.filter((x) => x.id !== id);
    this.setState({
      results: fltrdTsks,
    });
  };
  addTask = () => {
    const { results } = this.state;
    let obj = {
      id: results.length + 1,
      username: `test ${results.length + 1}`,
      body: `test body ${results.length + 1}`,
      title: `test title ${results.length + 1}`,
    };
    this.setState({
      results: [obj, ...results],
    });
  };

  render() {
    return (
      <div className="AppSearcher">
        <div className="row">
          <div className="col-12 mb-5 p-5">
            <SearchForm onSearch={this.setResults} />
          </div>
        </div>
        <div className="row">
          <section className="col-12">
            <h3>
              Results:{" "}
              <span data-testid="count">{this.state.results.length}</span>
            </h3>
            <hr />
          </section>
          <button onClick={() => this.addTask()}>Add Task</button>
          {this.state.results.map((res) => {
            return (
              <ResultCard
                key={res.id}
                id={res.id}
                username={res.username}
                title={res.title}
                body={res.body}
                toggleCard={this.toggleCard}
                toggleElementId={this.state.toggleElementId}
                deleteTask={this.deleteTask}
                addTask={this.addTask}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
