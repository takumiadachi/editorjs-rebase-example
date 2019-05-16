import React from "react";
import ReactDOM from "react-dom";
import * as OfflinePluginRuntime from "offline-plugin/runtime";
import "./css/index.css";
// Mobx
import { observer } from "mobx-react";
// Rebase
// import base from "./rebase";
// My Components
import AddItem from "./todo/AddItem";
import List from "./todo/List";
import CPreview from "./CPreview";
// EditorJS
import EditorJS from "@editorjs/editorjs";
import ejsHeader from "@editorjs/header";
import ejsCheckList from "@editorjs/checklist";
import ejsList from "@editorjs/list";
import ejsEmbed from "@editorjs/embed";
import ejsInlineCode from "@editorjs/inline-code";
import ejsQuote from "@editorjs/quote";
import ejsCodeTool from "@editorjs/code";
import ejsSimpleImage from "@editorjs/simple-image";
// import ejsTable from "@editorjs/table";
//import ejsImage from "@editorjs/image";
//import ejsLink from "@editorjs/Link";

const ONLINE = `<div style="color:green">PWA Online!</div>`;
const OFFLINE = `<div style="color:GoldenRod">PWA Offline</div>`;

window.addEventListener("load", () => {
  console.log("Event: Load");

  function updateOnlineStatus() {
    if (navigator.onLine) {
      document.getElementById("status").innerHTML = ONLINE;
    } else {
      document.getElementById("status").innerHTML = OFFLINE;
    }
  }

  setTimeout(() => {
    updateOnlineStatus();
  }, 500);

  // Reconnect online event
  window.addEventListener("online", () => {
    console.log("Event: Online");
    document.getElementById("status").innerHTML = ONLINE;
  });

  // Lose connection event
  window.addEventListener("offline", () => {
    console.log("Event: Offline");
    document.getElementById("status").innerHTML = OFFLINE;
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

/**
 * Converts '>', '<', '&' symbols to entities
 */
function encodeHTMLEntities(string) {
  return string
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Some styling magic
 */
function stylize(string) {
  /** Stylize JSON keys */
  string = string.replace(/"(\w+)"\s?:/g, '"<span class=sc_key>$1</span>" :');
  /** Stylize tool names */
  string = string.replace(
    /"(paragraph|quote|list|header|link|code|image|delimiter|raw|checklist|table|embed|warning)"/g,
    '"<span class=sc_toolname>$1</span>"'
  );
  /** Stylize HTML tags */
  string = string.replace(
    /(&lt;[\/a-z]+(&gt;)?)/gi,
    "<span class=sc_tag>$1</span>"
  );
  /** Stylize strings */
  string = string.replace(/"([^"]+)"/gi, '"<span class=sc_attr>$1</span>"');
  /** Boolean/Null */
  string = string.replace(
    /\b(true|false|null)\b/gi,
    "<span class=sc_bool>$1</span>"
  );
  return string;
}

@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      data: ""
    };

    this.refsEditor = React.createRef();
    this.refsSaveButton = React.createRef();
    this.editor = null;
  }

  componentWillMount() {}

  saveData() {
    console.log("data saved!");
    this.editor.save().then(savedData => {
      let output = JSON.stringify(savedData, null, 4);
      output = encodeHTMLEntities(output);
      output = stylize(output);
      this.setState({
        data: output
      });
    });
  }

  componentDidUpdate(prevState) {
    console.log("App prev", prevState);
    console.log("App next", this.state);
  }

  componentDidMount() {
    // this.ref1 = base.syncState("todoList", {
    //   context: this,
    //   state: "list",
    //   asArray: true,
    //   then() {
    //     this.setState({ loading: false });
    //   }
    // });

    this.editor = new EditorJS({
      holder: "codex-editor",
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
        code: ejsCodeTool,
        inlineCode: {
          class: ejsInlineCode,
          shortcut: "CMD+SHIFT+M"
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
        // table: {
        //   class: ejsTable,
        //   inlineToolbar: true,
        //   config: {
        //     rows: 1,
        //     cols: 1
        //   }
        // },
        image: ejsSimpleImage,
        // Initial editor data.
        /**
         * onReady callback
         */
        onReady: () => {
          console.log("Editor.js onReady");
        },
        /**
         * onChange callback
         */
        onChange: () => {
          console.log("Now I know that Editor's content changed!");
        }
      },
      data: {
        blocks: [
          {
            type: "header",
            data: {
              text: "Editor.js Dummy Data",
              level: 2
            }
          },
          {
            type: "paragraph",
            data: {
              text: "Hey. Edit this and save and see the json preview below!"
            }
          }
        ]
      }
    });

    this.editor.isReady
      .then(() => {
        console.log("Editor.js is ready to work!");
        /** Do anything you need after editor initialization */
        this.saveData();
      })
      .catch(reason => {
        console.log(`Editor.js initialization failed because of ${reason}`);
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
        {/* <div>
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
        </div> */}
        {/** */}

        <div className="edit-area" id="codex-editor" ref={this.refsEditor} />
        <div className="button-area">
          <button onClick={this.saveData.bind(this)}>editor.save</button>
        </div>
        <div className="preview-area">
          <CPreview data={this.state.data} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
