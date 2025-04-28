import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';

const Sidebar = () => {
  const categorias = ['Traditional Wear', 'Western Wear', 'Swimwear', 'Beauty', 'Jewelry', 'Watches', 'Accessories'];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#f4f4f4' },
      }}
    >
      <List>
        {categorias.map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
