
import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('No email credentials provided - using ethereal email for testing');
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'boxclear@example.com',
          pass: 'password123',
        },
      });
    }
    
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  return transporter;
}

export async function sendEmail(params) {
  try {
    const mailTransporter = getTransporter();
    
    const info = await mailTransporter.sendMail({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text || '', 
      html: params.html || '',
    });
    
    console.log('Message sent: %s', info.messageId);
    
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

export function isEmailConfigured() {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}
