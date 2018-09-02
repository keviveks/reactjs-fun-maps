import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAP_API_KEY } from '../../constants/secrets';

const CurrentMapPage = () =>
  <div>
    <h2>Get User Current Location</h2>
    <CurrentMap />
  </div>

const MapMarker = (props) =>
  <div style={props.style}>
    {props.text}
  </div>

const INITIAL_STATE = {
  lat: 12.9716,
  lng: 77.5946,
};

class CurrentMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: INITIAL_STATE,
      zoom: 11,
    };
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { center } = this.state;
          center.lat = position.coords.latitude;
          center.lng = position.coords.longitude;
          this.setState({ center });
        }
      );
    } else {
      console.log('navigatore geolocation filed can\' get current lat long');
    }
  }

  render() { 
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          <MapMarker
            style={{ height: '30px', width: '40px', border: '1px black solid', backgroundColor: 'red' }}
            lat={this.state.center.lat}
            lng={this.state.center.lng}
            text='You are here!'
          />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default CurrentMapPage;