var React = require("react");

class List extends React.Component {
  render() {
    var styles = {
      listGroup: {
        margin: "5px 0"
      },
      removeItem: {
        position: "absolute",
        top: 22,
        left: 6,
        cursor: "pointer",
        color: "rgb(222, 79, 79)",
        border: "none",
        padding: 0
      },
      todoItem: {
        paddingLeft: 20,
        fontSize: 18
      }
    };
    var listItems = this.props.items.map((item, index) => {
      return (
        <li key={index} style={styles.listGroup}>
          <button onClick={this.props.remove.bind(null, index)}>Remove</button>
          <span style={styles.todoItem}>{item}</span>
        </li>
      );
    });
    return (
      <div className="col-sm-12">
        <ul className="list-group">{listItems}</ul>
      </div>
    );
  }
}

module.exports = List;
