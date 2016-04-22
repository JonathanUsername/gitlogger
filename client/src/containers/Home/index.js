import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CssModules from 'react-css-modules';
import EventRow from '../../components/EventRow';

// import {bindActionCreators} from 'redux';

// import * as actionCreators from '../../actions/events';

import styles from './styles.css';

class Home extends Component {

  render() {
    const { events } = this.props;

    const eventRows = events.map((i, idx) => {
      return (
        <EventRow key={idx} {...i} />
      );
    });

    return (
      <div>
        <div styleName={'container'}>
          {eventRows}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  children: PropTypes.node,
  events: PropTypes.array
};

const mapStateToProps = ({events}) => events;

export default connect(mapStateToProps)(CssModules(Home, styles));
