import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockResetIcon from '@mui/icons-material/LockReset';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', 
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4
};


const ForgotPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [tokenSent, setTokenSent] = useState(false);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestToken = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/login/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setTokenSent(true);
        setMessage('📧 Token enviado al correo.');
      } else {
        setMessage(data.message || 'Error al solicitar token.');
      }
    } catch (err) {
      setMessage('Error al conectar con el servidor.');
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/login/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Contraseña actualizada correctamente.');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage(data.message || 'Error al cambiar la contraseña.');
      }
    } catch (err) {
      setMessage('Error al conectar con el servidor.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Recuperar contraseña
        </Typography>

        {!tokenSent ? (
          <>
            <TextField
              label="Correo electrónico"
              fullWidth
              variant='standard'
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleRequestToken}
              sx={{ mt: 2, bgcolor: '#10069f', color: 'white' }}
            >
              Enviar token de recuperación
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="Token"
              fullWidth
              margin="normal"
              variant='standard'
              value={token}
              onChange={(e) => setToken(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Nueva contraseña"
              fullWidth
              margin="normal"
              variant='standard'
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockResetIcon />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleResetPassword}
              sx={{ mt: 2, bgcolor: '#10069f', color: 'white' }}
            >
              Cambiar contraseña
            </Button>
          </>
        )}

        {message && (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ForgotPasswordModal;
