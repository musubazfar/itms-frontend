// import React, { useState } from 'react';
// import { IconButton, Menu, MenuItem, Badge, ListItemText } from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';

// const NotificationMenu = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <IconButton
//         aria-controls={open ? 'notification-menu' : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? 'true' : undefined}
//         onClick={handleClick}
//         color="inherit"
//       >
//         <Badge badgeContent={4} color="error">
//           <NotificationsIcon />
//         </Badge>
//       </IconButton>
//       <Menu
//         id="notification-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           'aria-labelledby': 'notification-button',
//         }}
//       >
//         <MenuItem onClick={handleClose}>
//           <ListItemText primary="Alert 1" secondary="This is an alert" />
//         </MenuItem>
//         <MenuItem onClick={handleClose}>
//           <ListItemText primary="Alert 2" secondary="This is another alert" />
//         </MenuItem>
//         <MenuItem onClick={handleClose}>
//           <ListItemText primary="Alert 3" secondary="Yet another alert" />
//         </MenuItem>
//         <MenuItem onClick={handleClose}>
//           <ListItemText primary="Alert 4" secondary="Last alert" />
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default NotificationMenu;
/*----------------------------------------------Scrolling enabled-----------------------------------------------------------*/
// import React, { useState } from 'react';
// import { IconButton, Menu, MenuItem, Badge, ListItemText } from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';

// const NotificationMenu = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   // Example notifications array
//   const notifications = [
//     { id: 1, title: 'Alert 1', message: 'This is an alert' },
//     { id: 2, title: 'Alert 2', message: 'This is another alert' },
//     { id: 3, title: 'Alert 3', message: 'Yet another alert' },
//     { id: 4, title: 'Alert 4', message: 'Last alert' },
//     { id: 5, title: 'Alert 5', message: 'Another alert' },
//     { id: 6, title: 'Alert 6', message: 'Yet another alert' },
//     { id: 7, title: 'Alert 7', message: 'Yet another alert' },
//     { id: 8, title: 'Alert 8', message: 'Yet another alert' },
//     // Add more notifications as needed
//   ];

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <IconButton
//         aria-controls={open ? 'notification-menu' : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? 'true' : undefined}
//         onClick={handleClick}
//         color="inherit"
//       >
//         <Badge badgeContent={notifications.length} color="error">
//           <NotificationsIcon />
//         </Badge>
//       </IconButton>
//       <Menu
//         id="notification-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           style: {
//             maxHeight: 48 * 5, // Adjust this value to set the maximum height (4.5 items here)
//             width: '300px', // Adjust the width as needed
//           },
//         }}
//         MenuListProps={{
//           'aria-labelledby': 'notification-button',
//         }}
//       >
//         {notifications.map((notification) => (
//           <MenuItem key={notification.id} onClick={handleClose}>
//             <ListItemText
//               primary={notification.title}
//               secondary={notification.message}
//             />
//           </MenuItem>
//         ))}
//       </Menu>
//     </div>
//   );
// };

// export default NotificationMenu;
/*----------------------------------------------Read and unread feature-----------------------------------------------------------*/
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Badge, ListItemText, ListItemIcon, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckIcon from '@mui/icons-material/Check';

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Alert 1', message: 'This is an alert', read: false },
    { id: 2, title: 'Alert 2', message: 'This is another alert', read: false },
    { id: 3, title: 'Alert 3', message: 'Yet another alert', read: false },
    { id: 4, title: 'Alert 4', message: 'Last alert', read: false },
    { id: 5, title: 'Alert 5', message: 'Another alert', read: false },
    { id: 6, title: 'Alert 6', message: 'Yet another alert', read: false },
    { id: 7, title: 'Alert 7', message: 'Yet another alert', read: false },
    { id: 8, title: 'Alert 8', message: 'Yet another alert', read: false },
  ]);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    handleClose();
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? 'notification-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '300px',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'notification-button',
        }}
      >
        <MenuItem>
          <Button onClick={handleMarkAllAsRead} fullWidth>
            Mark All as Read
          </Button>
        </MenuItem>
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={() => handleNotificationClick(notification.id)}>
            <ListItemIcon>
              {notification.read ? (
                <CheckIcon fontSize="small" />
              ) : (
                <FiberManualRecordIcon fontSize="small" color="primary" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={notification.title}
              secondary={notification.message}
              style={{ textDecoration: notification.read ? 'line-through' : 'none' }}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default NotificationMenu;
