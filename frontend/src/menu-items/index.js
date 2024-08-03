import dashboard from './dashboard';
import analytics from './analytics';
import pages from './pages';
import application from './application'
import products from "./products"
import extra from './extra.js';
import utilities from './utilities';
import settings from './settings';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard,analytics,application,products,settings, extra ,pages, utilities, other]
};

export default menuItems;
