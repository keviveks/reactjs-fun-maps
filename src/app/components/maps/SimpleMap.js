import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import GoogleMapWrapper from '../../GoogleMapWrapper';
import { GOOGLE_MAP_API_KEY } from '../../constants/secrets';

const SimpleMapPage = (props) =>
  <div>
    <h2>Simple Map</h2>
    <SimpleMap google={props.google} />
  </div>

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 12.9716,
      lng: 77.5946
    },
    zoom: 11
  };

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      let { google, center, zoom } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      const { lat, lng } = center;
      center = new maps.LatLng(lat, lng);

      const mapConfig = {
        center: center,
        zoom: zoom,
      };
      this.map = new maps.Map(node, mapConfig);
    }
  }

  render() {
    const style = { width: '100vw', height: '100vh' };
    return (
      <div ref="map" style={style}>
        Loading map...
      </div>
    );
  }
}

SimpleMap.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  center: PropTypes.object,
};

export default GoogleMapWrapper({
  apiKey: GOOGLE_MAP_API_KEY
})(SimpleMapPage);
