import React from "react";
import PropTypes from "prop-types";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";

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
      <pre className="json-output">{ReactHtmlParser(this.props.data)}</pre>
    );
  }
}

CPreview.defaultProps = {
  data: ""
};

CPreview.propTypes = {
  data: PropTypes.any.isRequired
};

export default CPreview;
