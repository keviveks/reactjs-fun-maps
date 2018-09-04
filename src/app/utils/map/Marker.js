import { Component } from 'react';
import PropTypes from 'prop-types';

import { camalize } from '../lib/String';
import { wrappedPromise } from '../lib/Promise';

const eventNames = [
  'click',
  'dblclick',
  'dragend',
  'mousedown',
  'mouseout',
  'mouseover',
  'mouseup',
  'recenter',
];

class Marker extends Component {
  componentDidMount() {
    this.markerPromise = wrappedPromise();
    this.renderMarker();
  }

  componentDidUpdate(prevProps) {
    const { map, position, icon } = this.props;
    if (
      map !== prevProps.map
      || position !== prevProps.position
      || icon !== prevProps.icon
    ) {
      // clear the marker from map before render
      if (this.marker) this.marker.setMap(null);
      // render the new marker
      this.renderMarker();
    }
  }

  componentWillMount() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  renderMarker() {
    const { map, google, position, mapCenter, icon, title, label, draggable, ...props } = this.props;

    if (!google) return;

    let pos = position || mapCenter;
    if (!(pos instanceof google.maps.LatLng)) {
      pos = new google.maps.LatLng(pos.lat, pos.lng);
    }

    this.marker = new google.maps.Marker({
      map,
      position: pos,
      icon,
      title,
      label,
      draggable,
      ...props
    });

    eventNames.forEach(e => {
      this.marker.addListener(e, this.handleEvent(e));
    });
    // TODO: check the promise function call
    this.markerPromise.resolve(this.marker);
  }

  getMarker() {
    return this.markerPromise;
  }

  handleEvent(event) {
    return (e) => {
      const eventName = `on${camalize(event)}`;
      if (this.props[eventName]) {
        this.props[eventName](this.props, this.marker, e);
      }
    }
  }

  render() {
    return null;
  }
}

// eventNames.forEach(e => Marker.propTypes[e] = PropTypes.func);

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
};

Marker.defaultProps = {
  name: 'Marker',
};

export default Marker;
