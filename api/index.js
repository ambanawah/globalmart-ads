const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// ── PRODUCTS ──────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.product_id as id, p.name, p.price, p.image_url as image,
                   c.name as category
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.is_active = true
            ORDER BY p.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM products WHERE product_id = $1',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// ── ORDERS ────────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
    const { user_id, items, total_amount } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
            'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING order_id',
            [user_id, total_amount]
        );
        const order_id = rows[0].order_id;

        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES ($1,$2,$3,$4,$5)',
                [order_id, item.id, item.quantity, item.price, item.price * item.quantity]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true, order_id });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Order failed' });
    } finally {
        client.release();
    }
});

// ── HEALTH CHECK (test from phone) ───────────────────────
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', db: 'connected', time: new Date() });
    } catch (err) {
        res.status(500).json({ status: 'error', db: 'disconnected' });
    }
});

module.exports = app;