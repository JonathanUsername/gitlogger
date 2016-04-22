import React, {Component, PropTypes} from 'react';

class MainLayout extends Component {
  render() {

    return (
      <div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.node
};

export default MainLayout;
