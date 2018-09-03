import React from 'react';
import { Link } from 'react-router-dom';
import * as routes from './constants/routes';
import './App.css';

const Navigation = () =>
  <ul className="Navigation-links">
    <li><Link to={routes.LANDING}>Home</Link></li>
    <li><Link to={routes.SIMPLE}>Simple</Link></li>
    <li><Link to={routes.CURRENT}>Current</Link></li>
    <li><Link to={routes.LOCATION}>Location</Link></li>
    <li><Link to={routes.NAVIGATION}>Navigation</Link></li>
    <li><Link to={routes.SEARCH}>Search</Link></li>
    <li><Link to={routes.PLACES}>Places</Link></li>
  </ul>

export default Navigation;
