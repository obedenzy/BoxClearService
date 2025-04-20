
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255)
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  addons JSONB,
  payment_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,
  stripe_payment_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
