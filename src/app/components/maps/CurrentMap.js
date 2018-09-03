import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import GoogleMapWrapper from '../../GoogleMapWrapper';
import { GOOGLE_MAP_API_KEY } from '../../constants/secrets';

const pos = {
  lat: 12.9716,
  lng: 77.5946
};

class CurrentMapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    };
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onInfoWindowClose() {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    })
  }

  render() {
    return (
      <div>
        <h2>Current User Location Map</h2>
        <CurrentMap google={this.props.google}>
          <Marker position={pos} onClick={this.onMarkerClick} title={"You are here!"}>
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
              <div>
                <h1>{this.state.selectedPlace.title}</h1>
              </div>
            </InfoWindow>
          </Marker>
        </CurrentMap>
      </div>
    );
  }
}

class CurrentMap extends Component {
  static defaultProps = {
    center: {
      lat: 12.9716,
      lng: 77.5946
    },
    zoom: 11
  };

  constructor(props) {
    super(props);

    const { center } = this.props;
    this.state = { center };
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          let { lat, lng } = {...this.state.center};
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          this.setState({
            center: { lat, lng }
          });
        }
      );
    }
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.center !== this.state.center) {
      this.recenterMap();
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      let { google, center, zoom } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      const { lat, lng } = this.state.center;
      center = new maps.LatLng(lat, lng);
      zoom = 15;

      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      });
      this.map = new maps.Map(node, mapConfig);
    }
  }

  recenterMap() {
    const map = this.map;
    const { lat, lng } = this.state.center;

    const { google } = this.props;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(lat, lng);
      map.panTo(center);
    }
  }

  renderChildren() {
    const { children } = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        center: this.state.center,
      });
    });
  }

  render() {
    const style = { width: '100vw', height: '100vh' };
    return (
      <div ref="map" style={style}>
        Loading map...
        {this.renderChildren()}
      </div>
    );
  }
}

CurrentMap.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  center: PropTypes.object,
};

class Marker extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.map !== this.props.map
      || prevProps.position !== this.props.position
    ) {
      this.renderMarker();
    }
  }

  renderMarker() {
    let { map, google, position, center } = this.props;
    const { lat, lng } = position || center;

    position = new google.maps.LatLng(lat, lng);
    this.marker = new google.maps.Marker({ position, map });
  }

  render() {
    return null;
  }
}

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
};

class InfoWindow extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.map !== prevProps.map) {
      this.renderInfoWindow();
    }

    if (this.props.children !== prevProps.children) {
      this.updateContent();
    }

    if (this.props.visible !== prevProps.visible) {
      this.props.visible ?
        this.openWindow() :
        this.closeWindow();
    }
  }

  renderInfoWindow() {
    let {map, google, mapCenter} = this.props;

    const iw = this.infowindow = new google.maps.InfoWindow({
      content: ''
    });

    google.maps.event
      .addListener(iw, 'closeclick', this.onClose.bind(this))
    google.maps.event
      .addListener(iw, 'domready', this.onOpen.bind(this));
  }

  updateContent() {
    const content = this.renderChildren();
    this.infowindow
      .setContent(content);
  }

  renderChildren() {
    const {children} = this.props;
    return ReactDOMServer.renderToString(children);
  }

  openWindow() {
    this.infowindow
      .open(this.props.map, this.props.marker);
  }
  closeWindow() {
    this.infowindow.close();
  }

  onOpen() {
    if (this.props.onOpen) this.props.onOpen();
  }

  onClose() {
    if (this.props.onClose) this.props.onClose();
  }

  render() {
    return null;
  }
}

export default GoogleMapWrapper({
  apiKey: GOOGLE_MAP_API_KEY
})(CurrentMapPage);
