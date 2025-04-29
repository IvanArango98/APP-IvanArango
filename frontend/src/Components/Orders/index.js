import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Collapse, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const OrdenesUsuario = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRow, setOpenRow] = useState(null);

  const token = cookies.get('_s');

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const userName = localStorage.getItem('userName'); 
        console.log(userName,token)
  
        if (!token || !userName) {
          throw new Error('Faltan datos de autenticación');
        }
  
        const [ordersResponse, productsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/orders/getAllOrders', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          }),
          fetch('http://localhost:8080/api/products/getAllProducts', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          })
        ]);
  
        if (!ordersResponse.ok || !productsResponse.ok) {
          throw new Error('Error en la consulta de órdenes o productos');
        }
  
        const ordersData = await ordersResponse.json();
        const productsData = await productsResponse.json();
  
        // Filtrar órdenes por el userName guardado
        const filteredOrders = (ordersData.value || []).filter(
          (orden) => orden.userName === userName
        );
  
        setOrdenes(filteredOrders);
        setProductos(productsData.value || []);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const getNombreProducto = (productId) => {
    const producto = productos.find(p => p.id === productId);
    return producto ? producto.name : `Producto ID ${productId}`;
  };

  const formatFecha = (fechaHora) => {
    if (!fechaHora) return '';
    const [fecha] = fechaHora.split(' ');
    return fecha;
  };

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
                <TableCell />
                <TableCell><strong># Orden</strong></TableCell>
                <TableCell><strong>Fecha Orden</strong></TableCell>
                <TableCell><strong>Usuario</strong></TableCell>
                <TableCell><strong>Dirección Envío</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Total (Q)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenes.length > 0 ? (
                ordenes.map((orden) => (
                  <React.Fragment key={orden.orderId}>
                    <TableRow>
                      <TableCell>
                        <IconButton size="small" onClick={() => setOpenRow(openRow === orden.orderId ? null : orden.orderId)} style={{color:"white"}}>
                          {openRow === orden.orderId ? <RemoveIcon /> : <AddIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{orden.orderId}</TableCell>
                      <TableCell>{formatFecha(orden.fechaOrden)}</TableCell>
                      <TableCell>{orden.userName}</TableCell>
                      <TableCell>{orden.shippingAddress}</TableCell>
                      <TableCell>{orden.status}</TableCell>
                      <TableCell>Q{orden.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={openRow === orden.orderId} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Typography variant="h6" gutterBottom component="div">
                              Productos
                            </Typography>
                            {orden.products && orden.products.length > 0 ? (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell><strong>Nombre del Producto</strong></TableCell>
                                    <TableCell><strong>Cantidad</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {orden.products.map((producto, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{getNombreProducto(producto.productId)}</TableCell>
                                      <TableCell>{producto.quantity}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <Typography variant="body2">No hay productos en esta orden.</Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
