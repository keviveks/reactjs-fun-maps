import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import GoogleMapWrapper from '../../GoogleMapWrapper';
import { GOOGLE_MAP_API_KEY } from '../../constants/secrets';

// const pos = {
//   lat: 12.9716,
//   lng: 77.5946
// };

const CurrentMapPage = (props) =>
  <div>
    <h2>Current User Location Map</h2>
    <CurrentMap google={props.google}>
      <Marker />
      {/* <Marker position={pos} /> */}
    </CurrentMap>
  </div>

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

      const { lat, lng } = this.state;
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
    let { lat, lng } = this.state.center;

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

    console.log('marker');
    console.log(position);
    console.log(center);
    let pos = position || center;
    position = new google.maps.LatLng(pos.lat, pos.lng);

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

export default GoogleMapWrapper({
  apiKey: GOOGLE_MAP_API_KEY
})(CurrentMapPage);
