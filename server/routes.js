
import { createServer } from "http";
import Stripe from "stripe";
import { storage } from "./storage.js";
import { setupAuth } from "./auth.js";
import { sendBookingConfirmation, sendAdminBookingNotification } from "./notification.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

export async function registerRoutes(app) {
  setupAuth(app);

  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      const webhookResponse = await fetch('https://n8n.leadluxedigital.com/webhook-test/contactus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (webhookResponse.ok) {
        res.json({ sentStatus: 'success' });
      } else {
        throw new Error('Failed to send form data to webhook');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Failed to process contact form' });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = req.isAuthenticated()
        ? {
            ...req.body,
            userId: req.user.id,
            email: req.body.email || req.user.email,
          }
        : {
            ...req.body,
            userId: null,
          };

      if (!bookingData.userId && (!bookingData.email || !bookingData.phoneNumber)) {
        return res.status(400).json({ 
          message: "Email and phone number are required for guest bookings" 
        });
      }

      const booking = await storage.createBooking(bookingData);

      if (booking) {
        try {
          const webhookResponse = await fetch('https://n8n.leadluxedigital.com/webhook-test/bookingform', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              service: bookingData.serviceType,
              date: bookingData.date,
              timeSlot: bookingData.timeSlot,
              address: bookingData.address,
              email: bookingData.email,
              phone: bookingData.phoneNumber
            })
          });

          if (!webhookResponse.ok) {
            throw new Error('Webhook request failed');
          }
        } catch (error) {
          console.error('Error sending booking data to webhook:', error);
        }

        sendBookingConfirmation(booking).catch(err => {
          console.error("Failed to send booking confirmation:", err);
        });

        sendAdminBookingNotification(booking).catch(err => {
          console.error("Failed to send admin notification:", err);
        });
      }

      res.status(201).json({ booking, sentStatus: 'success' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      if (req.user.role === "admin") {
        const bookings = await storage.getAllBookings();
        return res.json(bookings);
      }
      
      const bookings = await storage.getBookingsByUserId(req.user.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/guest-bookings", async (req, res) => {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: "Email is required" });
    }
    
    try {
      const bookings = await storage.getBookingsByEmail(email);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const booking = await storage.getBookingById(parseInt(req.params.id));
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (req.user.role !== "admin" && booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const booking = await storage.getBookingById(parseInt(req.params.id));
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (req.user.role !== "admin" && booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const allowedFields = ["status", "notes"];
      const updateData = {};
      
      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      }
      
      if (req.user.role === "admin") {
        Object.assign(updateData, req.body);
      }
      
      const updatedBooking = await storage.updateBooking(parseInt(req.params.id), updateData);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const allowedFields = ["firstName", "lastName", "address", "phone"];
      const updateData = {};
      
      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      }
      
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe API key not configured" });
    }

    try {
      const { amount, bookingId, email } = req.body;
      
      const booking = await storage.getBookingById(parseInt(bookingId));
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (req.isAuthenticated()) {
        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
          return res.status(403).json({ message: "You don't have permission to pay for this booking" });
        }
      } 
      else if (email) {
        if (booking.email !== email) {
          return res.status(403).json({ message: "Email does not match booking" });
        }
      } else {
        return res.status(400).json({ message: "Email is required for guest payments" });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: {
          userId: booking.userId ? booking.userId.toString() : "guest",
          bookingId: bookingId.toString(),
          email: booking.email
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post('/api/get-or-create-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!stripe) {
      return res.status(500).json({ message: "Stripe API key not configured" });
    }

    let user = req.user;

    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        res.json({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        });
        
        return;
      } catch (error) {
        if (error.code !== 'resource_missing') {
          return res.status(500).json({ message: error.message });
        }
      }
    }
    
    if (!user.email) {
      return res.status(400).json({ message: 'No user email on file' });
    }

    try {
      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });
        
        customerId = customer.id;
        user = await storage.updateStripeCustomerId(user.id, customer.id);
      }

      const priceId = process.env.STRIPE_PRICE_ID || req.body.priceId;
      if (!priceId) {
        return res.status(400).json({ message: 'No price ID provided' });
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(user.id, {
        customerId, 
        subscriptionId: subscription.id
      });
  
      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error) {
      return res.status(400).json({ error: { message: error.message } });
    }
  });

  app.post('/api/webhook', async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe API key not configured" });
    }
    
    const payload = req.body;
    
    try {
      switch (payload.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = payload.data.object;
          
          if (paymentIntent.metadata?.bookingId) {
            const bookingId = parseInt(paymentIntent.metadata.bookingId);
            const userId = paymentIntent.metadata.userId === "guest" 
              ? null 
              : parseInt(paymentIntent.metadata.userId);
              
            await storage.createPayment({
              bookingId,
              userId,
              amount: paymentIntent.amount / 100,
              stripePaymentId: paymentIntent.id,
              status: 'succeeded'
            });
            
            await storage.updateBooking(bookingId, {
              paymentStatus: 'paid'
            });
            
            const booking = await storage.getBookingById(bookingId);
            if (booking) {
              sendBookingConfirmation(booking).catch(err => {
                console.error("Failed to send payment confirmation:", err);
              });
            }
          }
          break;
          
        case 'subscription_schedule.created':
          break;
          
        default:
          console.log(`Unhandled event type ${payload.type}`);
      }
      
      res.status(200).end();
    } catch (error) {
      console.log(`Webhook Error: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
