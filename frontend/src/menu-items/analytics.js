// assets
// import { FaUserAstronaut, FaUsers, FaIdCard, FaInfoCircle, FaCog } from "react-icons/fa";
import { BsFillClipboardDataFill } from "react-icons/bs";



// constant
const icons = {BsFillClipboardDataFill };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const analytics = {
  id: 'analytics',
  title: 'Analytics',
  type: 'group',
  children: [
    {
      id: 'analytics',
      title: 'Analytics',
      type: 'item',
      url: '/analytics/',
      icon: icons.BsFillClipboardDataFill,
      breadcrumbs: false
    }
  ]
};

export default analytics;
