import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const productos = [
  { id: 1, nombre: 'Guantes de Boxeo' },
  { id: 2, nombre: 'Casco de Ciclismo' },
  { id: 3, nombre: 'Ropa Deportiva' },
];

const ProductosRecomendados = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Productos Recomendados
      </Typography>
      <List>
        {productos.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.nombre} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProductosRecomendados;
