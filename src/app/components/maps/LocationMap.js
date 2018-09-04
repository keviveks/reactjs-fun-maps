import React, { Component } from 'react';
import Map from '../../utils/map';
import Marker from '../../utils/map/Marker';
import InfoWindow from '../../utils/map/InfoWindow';

class LocationMapPage extends Component {
  state = {
    showingInfoWindow: true,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });

  onMapClicked = () => {
    if (this.state.showingInfoWindow)
      this.setState({
        activeMarker: null,
        showingInfoWindow: false
      });
  }

  render() {
    const pos = {
      lat: 12.9716,
      lng: 77.5946
    };
    return (
      <div>
      <h2>Location User Location Map</h2>
      <Map
        className="map"
        google={this.props.google}
        onClick={this.onMapClicked}
        style={{ height: '100%', position: 'relative', width: '100%' }}
        zoom={14}
      >
        <Marker
          onClick={this.onMarkerClick}
          name={'Your current location'}
          position={pos}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    </div>
    );
  }
}


export default LocationMapPage;
