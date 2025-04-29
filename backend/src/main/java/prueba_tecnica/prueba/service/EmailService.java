package prueba_tecnica.prueba.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String subject = "Recuperación de contraseña - Prueba Técnica";
        String message = "Hola,\n\n" +
                "Recibimos una solicitud para restablecer tu contraseña.\n\n" +
                "Utiliza este token para restablecer tu contraseña:\n\n" +
                resetToken + "\n\n" +
                "Este token es válido por 1 hora.\n\n" +
                "Si no solicitaste este cambio, puedes ignorar este correo.\n\n" +
                "Saludos,\n" +
                "Equipo de Prueba Técnica.";

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(toEmail);
        email.setSubject(subject);
        email.setText(message);

        mailSender.send(email);
    }
}
