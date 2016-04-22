import React, {Component, PropTypes} from 'react';
import CssModules from 'react-css-modules';

import styles from './styles.css';

class EventRow extends Component {
  render() {
    const { branch, id, msg, repo, time, type, user } = this.props;

    let parts = [];
    let i = 0;

    if (repo) {
      parts.push(<span key={i} className={'icon mega-octicon octicon-repo'}>{repo}</span>);
      i++;
    }

    if (user) {
      parts.push(<span key={i} className={'part'}> {user}</span>);
      i++;
    }

    if (branch) {
      parts.push(<span key={i} className={'part'}> {branch}</span>);
      i++;
    }

    if (msg) {
      parts.push(<span key={i} className={'part'}> {msg}</span>);
      i++;
    }

    let classes = type;
    if (type === 'commit') {
      classes += ' ';
    }

    return (<div className={classes} styleName={'event-row'}>{parts}</div>);
  }
}

EventRow.propTypes = {
  branch: PropTypes.string,
  id: PropTypes.string,
  msg: PropTypes.string,
  repo: PropTypes.string,
  time: PropTypes.number,
  type: PropTypes.string,
  user: PropTypes.string
};

export default CssModules(EventRow, styles);
