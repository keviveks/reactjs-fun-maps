import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';

class InfoWindow extends Component {
  componentDidMount() {
    this.renderInfoWindow();
  }

  componentDidUpdate(prevProps) {
    const { google, map, position, children } = this.props;

    if (!google || !map) return;

    if (map !== prevProps.map) {
      this.renderInfoWindow();
    }

    if (position !== prevProps.position) {
      this.updatePosition();
    }

    if (children !== prevProps.children) {
      this.updateContent();
    }

    if (
      this.props.visible !== prevProps.visible
      || this.props.marker !== prevProps.marker
      || this.props.position !== prevProps.position
    ) {
      this.props.visible ?
        this.openWindow() : this.closeWindow();
    }
  }

  renderInfoWindow() {
    const { map, google, ...props } = this.props;

    if (!google || google.maps) return;

    const iw = this.infowindow = new google.maps.InfoWindow({
      content: '', ...props
    });

    google.maps.event.addListener(iw, 'closeclick', this.onClose.bind(this));
    google.maps.event.addListener(iw, 'domready', this.onOpen.bind(this));
  }

  updatePosition() {
    let { position, google } = this.props;
    if (!(position instanceof google.maps.LatLng)) {
      position = position && new google.maps.LatLng(position.lat, position.lng);
    }
    this.infowindow.setPosition(position);
  }

  updateContent() {
    const content = this.renderChildren();
    this.infowindow.setContent(content);
  }

  renderChildren() {
    const { children } = this.props;
    return ReactDOMServer.renderToString(children);
  }

  onOpen() {
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  openWindow() {
    this.infowindow.open(this.props.map, this.props.marker);
  }

  closeWindow() {
    this.infowindow.close();
  }

  render() {
    return null;
  }
}

InfoWindow.propTypes = {
  children: PropTypes.element.isRequired,
  map: PropTypes.object,
  marker: PropTypes.object,
  position: PropTypes.object,
  visible: PropTypes.bool,
};

InfoWindow.defaultProps = {
  visible: false,
};

export default InfoWindow;
