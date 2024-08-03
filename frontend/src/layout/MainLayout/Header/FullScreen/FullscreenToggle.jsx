import { useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import { AiOutlineFullscreen } from "react-icons/ai";

// ==============================|| FULL SCREEN TOGGLE ||============================== //

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const anchorRef = useRef(null);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.log(err));
      setIsFullscreen(false);
    }
  };

  return (
    <ButtonBase sx={{ borderRadius: '12px' }}>
      <Avatar
        variant="rounded"
        sx={{
          borderRadius: '12px',
          transition: 'all .2s ease-in-out',
          background: 'rgb(105, 59, 184)',
          color: 'white',
          '&:hover': {
            background: 'white',
            color: 'rgb(105, 59, 184)'
          }
        }}
        ref={anchorRef}
        onClick={handleFullscreenToggle} // Use this handler for fullscreen toggle
        color="inherit"
      >
        <AiOutlineFullscreen stroke={1.5} size="1.3rem" />
      </Avatar>
    </ButtonBase>
  );
};

export default FullscreenToggle;
