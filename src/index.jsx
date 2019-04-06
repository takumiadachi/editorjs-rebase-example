import React from "react";
import ReactDOM from "react-dom";
import * as OfflinePluginRuntime from "offline-plugin/runtime";
import "./css/index.scss";
// Mobx
import { observer } from "mobx-react";
// Rebase
import base from "./rebase";
// My Components
import AddItem from "./todo/AddItem";
import List from "./todo/List";

window.addEventListener("load", () => {
  console.log("Event: Load");

  function updateNetworkStatus() {
    if (navigator.onLine) {
      document.getElementById("status").innerHTML = "Online!";
    } else {
      document.getElementById("status").innerHTML = "Offline";
    }
  }

  setTimeout(() => {
    updateNetworkStatus();
  }, 500);

  window.addEventListener("offline", () => {
    console.log("Event: Offline");
    document.getElementById("status").innerHTML = "Offline";
  });

  window.addEventListener("online", () => {
    console.log("Event: Online");
    document.getElementById("status").innerHTML = "Online!";
  });
});

OfflinePluginRuntime.install({
  onInstalled: () => {
    console.log("SW Event: onInstalled");
  },

  onUpdating: () => {
    console.log("SW Event: onUpdating");
  },

  onUpdateReady: () => {
    console.log("SW Event: onUpdateReady");
    // Tells to new SW to take control immediately
    OfflinePluginRuntime.applyUpdate();
  },

  onUpdated: () => {
    console.log("SW Event: onUpdated");
  }
});

@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };

    this.refsEditor = React.createRef();
  }

  componentDidMount() {
    // this.refsEditor.current.focus();
    //
    this.ref1 = base.syncState("todoList", {
      context: this,
      state: "list",
      asArray: true,
      then() {
        this.setState({ loading: false });
      }
    });
  }

  handleAddItem(newItem) {
    this.setState({
      list: this.state.list.concat([newItem])
    });
    this.setState({
      list2: this.state.list2.concat([newItem])
    });
  }

  handleRemoveItem(index) {
    var newList = this.state.list;
    newList.splice(index, 1);
    this.setState({
      list: newList
    });
    this.setState({
      list2: newList
    });
  }

  componentWillMount() {}

  render() {
    return (
      <div>
        {/** */}
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-md-offset-3">
              <div className="col-sm-12">
                <h3 className="text-center"> re-base Todo List </h3>
                <AddItem add={this.handleAddItem.bind(this)} />
                {this.state.loading === true ? (
                  <h3> LOADING... </h3>
                ) : (
                  <List
                    items={this.state.list}
                    remove={this.handleRemoveItem.bind(this)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/** */}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
