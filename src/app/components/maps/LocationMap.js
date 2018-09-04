import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import GoogleMapWrapper from '../../GoogleMapWrapper';
import { GOOGLE_MAP_API_KEY } from '../../constants/secrets';
import Marker from '../../utils/map/Marker';
import InfoWindow from '../../utils/map/InfoWindow';

class LocationMapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: true,
      activeMarker: {},
      selectedPlace: {},
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
  };

  onMarkerClick() {
    console.log('marker got clicked!!');
    this.setState({
      selectedPlace: 'props',
      activeMarker: 'marker',
      showingInfoWindow: true,
    });
    // e.preventDefault();
  }

  render() {
    const pos = {
      lat: 12.9716,
      lng: 77.5946
    };
    return (
      <div>
      <h2>Location User Location Map</h2>
      <LocationMap google={this.props.google}>
        <Marker
          onClick={this.onMarkerClick}
          name={'Your current location'}
          position={pos}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >some teeset as welll
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </LocationMap>
    </div>
    );
  }
}

class LocationMap extends Component {
  static defaultProps = {
    center: {
      lat: 12.9716,
      lng: 77.5946
    },
    zoom: 11,
    onMove: () => {
      console.log('map is getting moved!!');
    }
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

      let centerDragTimeout;
      // adding map dragging event
      this.map.addListener('dragend', (e) => {
        if (centerDragTimeout) {
          clearTimeout(centerDragTimeout);
          centerDragTimeout = null;
        }
        centerDragTimeout = setTimeout(() => {
          this.props.onMove(this.map);
        }, 0);
      });
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

LocationMap.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  center: PropTypes.object,
  onMove: PropTypes.func,
};

export default GoogleMapWrapper({
  apiKey: GOOGLE_MAP_API_KEY
})(LocationMapPage);
