// assets
import { FaAppStore,FaUserSecret,FaUserLock,FaQuestion } from "react-icons/fa";
import { BsCalendarHeart ,BsPinMap} from "react-icons/bs";

// constant
const icons = { FaAppStore,BsCalendarHeart,BsPinMap,FaUserSecret,FaUserLock,FaQuestion};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const extra = {
  id: 'extra',
  title: 'Extra',
  type: 'group',
  children: [
    {
      id: 'ext-calendar',
      title: 'Calendar',
      type: 'item',
      url: '/extra/calendar',
      icon: icons.BsCalendarHeart,
      breadcrumbs: false
    },
    {
        id: 'ext-map',
        title: 'Map',
        type: 'item',
        url: '/extra/map',
        icon: icons.BsPinMap,
        breadcrumbs: false
      },
      {
        id: 'ext-contact',
        title: 'Contact Us',
        type: 'item',
        url: '/extra/contact',
        icon: icons.FaUserSecret,
        breadcrumbs: false
      },
      {
        id: 'ext-faq',
        title: 'Faq',
        type: 'item',
        url: '/extra/faq',
        icon: icons.FaQuestion,
        breadcrumbs: false
      },  {
        id: 'ext-privacy',
        title: 'Privacy-Policy',
        type: 'item',
        url: '/extra/privacy-policy',
        icon: icons.FaUserLock,
        breadcrumbs: false
      }
  ]
};

export default extra