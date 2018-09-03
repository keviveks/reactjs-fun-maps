import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import * as routes from './constants/routes';
import Navigation from './Navigation';
import LandingPage from './Landing';
import SimpleMapPage from './components/maps/SimpleMap';
import CurrentMapPage from './components/maps/CurrentMap';
import LocationMapPage from './components/maps/LocationMap';
import NavigationMapPage from './components/routes/NavigationMap';
import SearchMapPage from './components/places/SearchMap';
import PlacesMapPage from './components/places/PlacesMap';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Fun Maps</h1>
        </header>
        <Router>
          <div className="Routers">
            <Navigation />
            <hr/>

            <Route exact path={routes.LANDING} component={() => <LandingPage />} />
            <Route exact path={routes.SIMPLE} component={() => <SimpleMapPage />} />
            <Route exact path={routes.CURRENT} component={() => <CurrentMapPage />} />
            <Route exact path={routes.LOCATION} component={() => <LocationMapPage />} />
            <Route exact path={routes.NAVIGATION} component={() => <NavigationMapPage />} />
            <Route exact path={routes.SEARCH} component={() => <SearchMapPage />} />
            <Route exact path={routes.PLACES} component={() => <PlacesMapPage />} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
