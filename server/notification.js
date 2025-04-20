
import { sendEmail, isEmailConfigured } from "./email.js";

export async function sendBookingConfirmation(booking) {
  const bookingDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const serviceName = getServiceNameFromType(booking.serviceType);
  
  const emailContent = `
    <h2>Your BoxClear Booking Confirmation</h2>
    <p>Thank you for booking with BoxClear! Your booking has been confirmed.</p>
    
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Service:</strong> ${serviceName}</li>
      <li><strong>Date:</strong> ${bookingDate}</li>
      <li><strong>Time:</strong> ${booking.timeSlot}</li>
      <li><strong>Address:</strong> ${booking.address}</li>
      <li><strong>Total:</strong> $${booking.price}</li>
    </ul>
    
    <p>If you need to make any changes to your booking, please contact us at support@boxclear.com or call (555) 123-4567.</p>
    
    <p>Thank you for choosing BoxClear for your cardboard removal needs!</p>
    
    <p>Best regards,<br>The BoxClear Team</p>
  `;

  try {
    const result = await sendEmail({
      to: booking.email,
      from: "bookings@boxclear.com",
      subject: "BoxClear - Booking Confirmation",
      html: emailContent,
      text: stripHtml(emailContent),
    });
    
    return result;
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    return false;
  }
}

export async function sendAdminBookingNotification(booking) {
  const emailContent = `
    <h2>New Booking Alert</h2>
    <p>A new booking has been created in the system.</p>
    
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Booking ID:</strong> ${booking.id}</li>
      <li><strong>Service:</strong> ${getServiceNameFromType(booking.serviceType)}</li>
      <li><strong>Customer Email:</strong> ${booking.email}</li>
      <li><strong>Customer Phone:</strong> ${booking.phoneNumber}</li>
      <li><strong>Date:</strong> ${booking.date.toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${booking.timeSlot}</li>
      <li><strong>Address:</strong> ${booking.address}</li>
      <li><strong>Total:</strong> $${booking.price}</li>
      <li><strong>Guest Booking:</strong> ${booking.userId ? 'No' : 'Yes'}</li>
    </ul>
    
    <p>Please review this booking in the admin dashboard.</p>
  `;

  try {
    const result = await sendEmail({
      to: "admin@boxclear.com",
      from: "system@boxclear.com",
      subject: "New BoxClear Booking",
      html: emailContent,
      text: stripHtml(emailContent),
    });
    
    return result;
  } catch (error) {
    console.error("Failed to send admin booking notification:", error);
    return false;
  }
}

function getServiceNameFromType(serviceType) {
  const serviceNames = {
    'standard': 'Standard Box Pickup',
    'express': 'Express Box Pickup',
    'business': 'Business Box Haul',
    'moving': 'Moving Box Collection'
  };
  
  return serviceNames[serviceType] || serviceType;
}

function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
