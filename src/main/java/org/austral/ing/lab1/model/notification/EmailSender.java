package org.austral.ing.lab1.model.notification;

import org.austral.ing.lab1.service.EmailService;

import javax.mail.MessagingException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class EmailSender {
  private final String recipientEmail;
  private final String subject;
  private final String messageText;

  private static final Logger LOGGER = Logger.getLogger(EmailSender.class.getName());

  public EmailSender(String recipientEmail, String subject, String messageText) {
    this.recipientEmail = recipientEmail;
    this.subject = subject;
    this.messageText = messageText;
  }

  public void sendEmailNotification() {
    EmailService emailService = new EmailService();
    try {
      emailService.sendEmail(recipientEmail, subject, messageText);
      LOGGER.log(Level.INFO, "Correo electrónico enviado a {0}", recipientEmail);
    } catch (MessagingException e) {
      LOGGER.log(Level.SEVERE, "Error al enviar el correo electrónico", e);
    }
  }
}
