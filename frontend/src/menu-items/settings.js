// assets
import { RxGear } from "react-icons/rx";




// constant
const icons = {RxGear};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //
const settings = {
    id: 'settings',
    title: 'Settings',
    caption: 'Changes',
    type: 'group',
    children: [
      {
        id: 'settings',
        title: 'Settings',
        type: 'collapse',
        icon: icons.RxGear,
        children: [
          {
            id: 'admin',
            title: 'Admin',
            type: 'item',
            url: '/admin',
            target: false
          },
          {
            id: 'about',
            title: 'About',
            type: 'item',
            url: '/settings/about',
            target: false
          },
          {
            id: 'branch',
            title: 'Branch',
            type: 'item',
            url: '/branch',
            target: false
          },
          {
            id: 'currencies',
            title: 'Currencies',
            type: 'item',
            url: '/settings/currencies',
            target: false
          },
          {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            url: '/settings/setting',
            target: false
          },
          {
            id: 'taxes',
            title: 'Taxes',
            type: 'item',
            url: '/settings/taxes',
            target: false
          }
        
        ]
      }
    ]
  };
  
  export default settings;
  