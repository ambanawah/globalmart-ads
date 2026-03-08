
# 📘 Project Documentation Template:  E-commerce Website

## 1. Introduction & Requirements (Member 1)
### 1.1 Project Overview
- **Project Name:** GlobalMart Ads E-commerce Website
- **Version:** 1.0
- **Date:** March 8, 2026
- **Prepared By:** NANSHIE ROMUALD      Matricule: ICTU20233780

### 1.2 Purpose
The GlobalMart Ads E-commerce Website is designed to provide a scalable online marketplace where users can browse, purchase, and review products. It includes advanced features like personalized recommendations, secure payments, and comprehensive analytics.

### 1.3 Scope
- **In Scope:** User registration, product catalog, shopping cart, checkout, payment processing, order management, reviews, admin dashboard.
- **Out of Scope:** Mobile app development, third-party integrations beyond payment gateways.

### 1.4 Functional Requirements
- User authentication and authorization
- Product search and filtering
- Shopping cart and wishlist
- Secure checkout and payment
- Order tracking
- Product reviews and ratings
- Admin panel for product and order management

### 1.5 Non-Functional Requirements
- Performance: Support up to 10,000 concurrent users
- Security: Implement SSL, data encryption, and compliance with GDPR
- Scalability: Use cloud services for horizontal scaling
- Availability: 99.9% uptime

---

## 2. System Design (Member 2)
### 2.1 High-Level Architecture Diagram
*(Insert diagram showing frontend, backend, database, APIs, and integrations)*

### 2.2 Technology Stack
- **Frontend:** React.js with Next.js framework
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT tokens
- **Payment Gateway:** Stripe
- **Hosting:** AWS (EC2, RDS, S3)
- **Deployment:** Docker and Kubernetes

### 2.3 System Components
- **Web Server:** Handles HTTP requests and serves the frontend
- **API Server:** Provides RESTful APIs for data operations
- **Database Server:** Stores all application data
- **Cache Layer:** Redis for session management and caching
- **Message Queue:** For asynchronous tasks like email notifications

### 2.4 Data Flow
1. User interacts with frontend
2. Frontend makes API calls to backend
3. Backend queries/updates database
4. Responses are sent back to frontend

---

## 3. Database Design & SQL Schema (Member 3)
### 3.1 Entity-Relationship Diagram
*(Insert ER diagram showing relationships between entities)*

### 3.2 Database Schema Overview
The database is designed using PostgreSQL with the following main entities:
- Users: Store customer and admin information
- Categories: Product categories for organization
- Products: Product catalog with details
- Orders: Customer orders
- Order_Items: Items within an order
- Payments: Payment transactions
- Addresses: Shipping and billing addresses
- Reviews: Customer feedback on products
- Carts: Shopping cart items
- Wishlists: User wishlists

### 3.3 SQL Schema
Below are the CREATE TABLE statements for the database schema.

```sql
-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT REFERENCES categories(category_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT REFERENCES categories(category_id),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    address_type VARCHAR(20) DEFAULT 'shipping' CHECK (address_type IN ('shipping', 'billing')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address_id INT REFERENCES addresses(address_id),
    billing_address_id INT REFERENCES addresses(address_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order_Items table
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Payments table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts table
CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Wishlists table
CREATE TABLE wishlists (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
```

### 3.4 Indexes and Constraints
- Primary keys on all tables
- Foreign key constraints to maintain referential integrity
- Unique constraints on email in users, and composite unique on carts and wishlists
- Indexes on frequently queried columns: email, category_id, product_id, order_id, user_id
- Check constraints on ratings and statuses

### 3.5 Advanced Features
- **Triggers:** Automatic update of updated_at timestamps
- **Stored Procedures:** For complex operations like order processing
- **Views:** For reporting, e.g., sales summary
- **Partitioning:** Orders table partitioned by date for performance
- **Backup Strategy:** Daily automated backups with point-in-time recovery

---

## 4. Implementation & Testing (Member 4)
### 4.1 Implementation Plan
- **Phase 1:** Setup development environment and database
- **Phase 2:** Implement user authentication and basic CRUD operations
- **Phase 3:** Develop product catalog and shopping features
- **Phase 4:** Integrate payment gateway and order management
- **Phase 5:** Add reviews, analytics, and admin features

### 4.2 Code Structure
- **Backend:** MVC pattern with controllers, models, routes
- **Frontend:** Component-based architecture with React
- **Database:** Migration scripts for schema changes

### 4.3 Testing Strategy
- **Unit Tests:** Test individual functions and database queries
- **Integration Tests:** Test API endpoints and user flows
- **End-to-End Tests:** Simulate user interactions with tools like Cypress
- **Performance Tests:** Load testing with JMeter
- **Security Tests:** Penetration testing and code reviews

### 4.4 Deployment
- Use CI/CD pipeline with GitHub Actions
- Dockerize the application
- Deploy to AWS with monitoring and logging

---  

---

## 8. Deployment & CI/CD
- **Version Control:** GitHub/GitLab  
- **CI/CD Pipeline:** GitHub Actions / Jenkins  
- **Containerization:** Docker images for services  
- **Monitoring:** Prometheus, Grafana, ELK stack  

---

## 9. Maintenance & Support
- **Bug Tracking:** Jira / Trello  
- **Update Policy:** Monthly feature updates, weekly patches  
- **Documentation Updates:** With each release  

---

## 10. Appendices
- Glossary of terms  
- References  
- Change log  

---

👉 This template gives you a **professional, database-focused structure** for documenting your e-commerce project.  

Would you like me to also create a **ready-to-use ER diagram schema** (with tables and relationships) so you can plug it directly into your project?
