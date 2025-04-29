import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const OrdenesUsuario = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = cookies.get('_s');

  useEffect(() => {
    fetch('http://localhost:8080/api/orders/getAllOrders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la consulta de órdenes');
        }
        return response.json();
      })
      .then(data => {
        setOrdenes(data.value || []);
      })
      .catch(error => {
        console.error('Error al obtener órdenes:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        Mis Órdenes
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', mx: 'auto', boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong># Orden</strong></TableCell>
                <TableCell><strong>Usuario</strong></TableCell>
                <TableCell><strong>Dirección Envío</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Total (Q)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenes.length > 0 ? (
                ordenes.map((orden) => (
                  <TableRow key={orden.orderId}>
                    <TableCell>{orden.orderId}</TableCell>
                    <TableCell>{orden.userName}</TableCell>
                    <TableCell>{orden.shippingAddress}</TableCell>
                    <TableCell>{orden.status}</TableCell>
                    <TableCell>Q{orden.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay órdenes registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OrdenesUsuario;
