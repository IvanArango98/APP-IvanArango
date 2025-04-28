import React from 'react';
import { Box, Typography } from '@mui/material';

const BannerPrincipal = () => {
  return (
    <Box 
      sx={{ 
        backgroundColor: '#dbeafe', 
        height: 200, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 2,
        mb: 3 
      }}
    >
      <Typography variant="h4" color="primary">
        ¡Bienvenido a la Tienda Deportiva!
      </Typography>
    </Box>
  );
};

export default BannerPrincipal;
