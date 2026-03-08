### 3. Database Design & SQL Schema
### 3.1 Introduction to Database Design

Following the system requirements and architecture described in the previous sections, the database layer is designed to support the core functionality of the GlobalMart Ads E-commerce Website. The database is responsible for storing, organizing, and managing all application data including users, products, orders, and transactions.

The system uses PostgreSQL, a relational database management system known for its reliability, scalability, and strong support for data integrity. The database schema is structured to ensure efficient data retrieval, maintain referential integrity between tables, and support the various operations required by the e-commerce platform.

The design follows standard relational database principles and normalization techniques to reduce redundancy and improve maintainability.

### 3.2 Entity–Relationship Model

Based on the system architecture defined earlier, the main entities required for the application include:

- Users – Stores customer and administrator accounts

- Categories – Organizes products into logical groups

- Products – Contains product information available in the store

- Addresses – Stores shipping and billing addresses

- Orders – Represents customer purchases

- Order Items – Lists products included in each order

- Payments – Records payment transactions

- Reviews – Stores customer product reviews

- Carts – Temporary storage of items selected by a user

- Wishlists – Products saved by users for future purchase

### Key Relationships

- One User can place multiple Orders

- One Order contains multiple Order Items

- One Product belongs to one Category

- One User can create multiple Reviews

- One Product can receive multiple Reviews

- One User can have multiple Addresses

- One User has a Cart containing multiple products

NB:These relationships ensure that the database structure reflects real-world e-commerce interactions.

### 3.3 Database Schema Overview

The database schema is implemented using multiple relational tables that represent the entities described above. Each table contains a primary key to uniquely identify records and foreign keys to maintain relationships between tables.

Key design considerations include:

* Ensuring data consistency using constraints

* Maintaining referential integrity between related entities

* Supporting efficient queries for common operations such as product search, order  retrieval, and user account management

The following tables form the core structure of the system:

 ### Table           	               Purpose
   - users	                    Stores customer and admin account information
   - categories	                Organizes products into categories
   - products	                Contains product information and pricing
   - addresses	                Stores user shipping and billing addresses
   - orders	                    Records customer orders
   - order_items & Details      products included in each order
   - payments	                Records payment information
   - reviews	                Stores product ratings and comments
   - carts	                    Temporary storage of shopping cart items
   - wishlists	                Stores products saved for later purchase

### 3.4 SQL Database Schema

The following SQL statements define the structure of the database tables used in the system.

### Users Table

This table stores all user accounts including customers and administrators.
  
  CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer'
        CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Categories Table

This table organizes products into hierarchical categories.

  CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT REFERENCES categories(category_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Products Table

This table stores all products available in the store.

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

### Addresses Table

This table stores user shipping and billing addresses.

  CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    address_type VARCHAR(20) DEFAULT 'shipping'
        CHECK (address_type IN ('shipping','billing')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Orders Table

This table records customer purchases.

  CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
    shipping_address_id INT REFERENCES addresses(address_id),
    billing_address_id INT REFERENCES addresses(address_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Order Items Table

This table stores the individual products included in each order.

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

### Payments Table

This table stores information about order payments.

  CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending','completed','failed','refunded')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Reviews Table

This table allows users to review and rate products.

  CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Carts Table

This table temporarily stores products selected by users before checkout.

  CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

### Wishlists Table

This table allows users to save products for future purchases.

  CREATE TABLE wishlists (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

### 3.5 Constraints and Data Integrity

Several constraints are applied within the database to ensure data validity and integrity.

* Primary Keys

Each table includes a primary key which uniquely identifies each record.

* Foreign Keys

Foreign key constraints are used to maintain relationships between related tables. 
For example:

- orders.user_id references users.user_id

- order_items.product_id references products.product_id

- reviews.product_id references products.product_id

* Unique Constraints

Certain fields must contain unique values. For example:

- Email addresses in the users table must be unique.

- The carts and wishlists tables enforce a unique combination of user and product to prevent duplicate entries.

* Check Constraints

Check constraints enforce valid data values, such as:

- Product ratings must be between 1 and 5

- Order status must match predefined states

- Payment status must match valid transaction states

### 3.6 Database Indexing

Indexes are implemented to improve query performance for frequently accessed columns.

Examples include indexing:

- users.email

- products.category_id

- orders.user_id

- order_items.order_id

### Example index creation:

CREATE INDEX idx_products_category
ON products(category_id);

Indexes significantly improve performance for product searches, order lookups, and user account queries.

### 3.7 Advanced Database Features

To enhance system efficiency and maintainability, additional database mechanisms may be implemented.

### Triggers

Triggers can automatically update the updated_at timestamp whenever a record is modified.

### Stored Procedures

Stored procedures may be used for complex operations such as order processing and inventory updates.

### Database Views

Views can simplify reporting and analytics queries, for example a sales summary view combining orders and payments.

### Backup Strategy

To prevent data loss, the system will implement automated backups with support for point-in-time recovery.

### 3.8 Summary

The database design provides a structured and scalable foundation for the GlobalMart Ads E-commerce system. By implementing relational tables, constraints, indexing strategies, and advanced database features, the system ensures efficient data storage, high performance, and strong data integrity.

This schema supports the main business operations of the platform including user management, product catalog management, order processing, payments, and customer reviews.