
import createMemoryStore from "memorystore";
import session from "express-session";
import { query } from "./db.js";

const MemoryStore = createMemoryStore(session);

class Storage {
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  async getUser(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getUserByUsername(username) {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async createUser(user) {
    const result = await query(
      'INSERT INTO users (username, email, password, first_name, last_name, address, phone, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user.username, user.email, user.password, user.firstName, user.lastName, user.address, user.phone, 'user']
    );
    return result.rows[0];
  }

  async updateUser(id, updateData) {
    const setters = [];
    const values = [id];
    let paramCount = 2;

    for (const [key, value] of Object.entries(updateData)) {
      setters.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    const query_string = `UPDATE users SET ${setters.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(query_string, values);
    return result.rows[0];
  }

  async updateStripeCustomerId(id, stripeCustomerId) {
    const result = await query(
      'UPDATE users SET stripe_customer_id = $1 WHERE id = $2 RETURNING *',
      [stripeCustomerId, id]
    );
    return result.rows[0];
  }

  async updateUserStripeInfo(id, info) {
    const result = await query(
      'UPDATE users SET stripe_customer_id = $1, stripe_subscription_id = $2 WHERE id = $3 RETURNING *',
      [info.customerId, info.subscriptionId, id]
    );
    return result.rows[0];
  }

  async createBooking(booking) {
    const result = await query(
      'INSERT INTO bookings (user_id, email, phone_number, service_type, price, date, time_slot, address, addons, notes, status, payment_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [booking.userId, booking.email, booking.phoneNumber, booking.serviceType, booking.price, booking.date, booking.timeSlot, booking.address, booking.addons, booking.notes, booking.status || 'pending', booking.paymentStatus || 'pending']
    );
    return result.rows[0];
  }

  async getBookingById(id) {
    const result = await query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getBookingsByUserId(userId) {
    const result = await query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  async getBookingsByEmail(email) {
    const result = await query('SELECT * FROM bookings WHERE email = $1 ORDER BY created_at DESC', [email]);
    return result.rows;
  }

  async updateBooking(id, updateData) {
    const setters = [];
    const values = [id];
    let paramCount = 2;

    for (const [key, value] of Object.entries(updateData)) {
      setters.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    const query_string = `UPDATE bookings SET ${setters.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await query(query_string, values);
    return result.rows[0];
  }

  async getAllBookings() {
    const result = await query('SELECT * FROM bookings ORDER BY created_at DESC');
    return result.rows;
  }

  async createPayment(payment) {
    const result = await query(
      'INSERT INTO payments (booking_id, user_id, amount, stripe_payment_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [payment.bookingId, payment.userId, payment.amount, payment.stripePaymentId, payment.status]
    );
    return result.rows[0];
  }

  async getPaymentById(id) {
    const result = await query('SELECT * FROM payments WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getPaymentsByUserId(userId) {
    const result = await query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  async getPaymentsByBookingId(bookingId) {
    const result = await query('SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC', [bookingId]);
    return result.rows;
  }
}

export const storage = new Storage();
