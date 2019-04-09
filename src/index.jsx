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
// EditorJS
import EditorJS from "@editorjs/editorjs";
import ejsHeader from "@editorjs/header";
import ejsCheckList from "@editorjs/checklist";
import ejsList from "@editorjs/list";
import ejsEmbed from "@editorjs/embed";
import ejsInlineCode from "@editorjs/inline-code";
import ejsQuote from "@editorjs/quote";
import ejsTable from "@editorjs/table";
// import ejsSimpleImage from "@editorjs/simple-image";
//import ejsImage from "@editorjs/image";
//import ejsLink from "@editorjs/Link";

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
    this.editor = null;
  }

  componentWillMount() {}

  componentDidMount() {
    this.ref1 = base.syncState("todoList", {
      context: this,
      state: "list",
      asArray: true,
      then() {
        this.setState({ loading: false });
      }
    });

    this.editor = new EditorJS({
      holderId: "codex-editor",
      autofocus: true,
      // Plugins
      tools: {
        header: {
          class: ejsHeader,
          shortcut: "CMD+SHIFT+H",
          config: {
            placeholder: "Enter a header"
          }
        },
        checklist: {
          class: ejsCheckList,
          inlineToolbar: true
        },
        list: {
          class: ejsList,
          inlineToolbar: true
        },
        embed: {
          class: ejsEmbed,
          config: {
            services: {
              youtube: true,
              coub: true
            }
          }
        },
        quote: {
          class: ejsQuote,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+O",
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author"
          }
        },
        inlineCode: {
          class: ejsInlineCode,
          shortcut: "CMD+SHIFT+M"
        },
        table: {
          class: ejsTable,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        }
        // image: ejsSimpleImage,
      }
    });
  }

  handleAddItem(newItem) {
    this.setState({
      list: this.state.list.concat([newItem])
    });
  }

  handleRemoveItem(index) {
    var newList = this.state.list;
    newList.splice(index, 1);
    this.setState({
      list: newList
    });
  }

  componentWillMount() {}

  render() {
    return (
      <div>
        {/** */}
        <div>
          <h3> re-base Todo List </h3>
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
        {/** */}
        <div id="codex-editor" ref={this.refsEditor} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
