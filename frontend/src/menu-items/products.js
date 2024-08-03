// assets
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';



// constant
const icons = { PrecisionManufacturingOutlinedIcon };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const products = {
  id: 'products',
  title: 'Products',
  caption: 'Products & Category',
  type: 'group',
  children: [
    {
      id: 'products',
      title: 'Products',
      type: 'collapse',
      icon: icons.PrecisionManufacturingOutlinedIcon,
      children: [
        {
          id: 'products',
          title: 'Products',
          type: 'item',
          url: '/products',
          target: false // Ensure the link opens in the same tab
        },
        {
          id: 'products-category',
          title: 'Products Category',
          type: 'item',
          url: '/category/products',
          target: false // Ensure the link opens in the same tab
        }
      ]
    }
  ]
};

export default products;
