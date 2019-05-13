import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class CPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    console.log("CPreview prev", prevProps);
    console.log("CPreview next", this.props);
  }

  render() {
    return (
      <div>
        <pre>{this.props.data}</pre>
      </div>
    );
  }
}

CPreview.defaultProps = {
  data: "test"
};

CPreview.propTypes = {
  data: PropTypes.any.isRequired
};

export default CPreview;
