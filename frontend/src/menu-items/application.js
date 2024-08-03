// assets
import { FaUserAstronaut,FaFortAwesome } from "react-icons/fa";



// constant
const icons = { FaUserAstronaut, FaFortAwesome };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const application = {
  id: 'application',
  title: 'Application',
  caption: 'Hello World',
  type: 'group',
  children: [
    {
      id: 'people',
      title: 'People',
      type: 'item',
      url: '/people',
      target: false, // Ensure the link opens in the same tab
      icon: icons.FaUserAstronaut,
    },
    {
      id: 'companies',
      title: 'Companies',
      type: 'item',
      url: '/companies',
      target: false, // Ensure the link opens in the same tab
      icon: icons.FaFortAwesome,

    }
  ]
};

export default application;
