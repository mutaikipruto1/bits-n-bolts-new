require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/parts', authenticateToken, async (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM parts WHERE 1=1';
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    query += ` AND name ILIKE $${params.length}`;
  }
  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/parts', authenticateToken, async (req, res) => {
  const { part_number, name, category, quantity, price } = req.body;
  try {
    await pool.query(
      'INSERT INTO parts (part_number, name, category, quantity, price) VALUES ($1, $2, $3, $4, $5)',
      [part_number, name, category, quantity, price]
    );
    res.status(201).json({ message: 'Part added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/parts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { part_number, name, category, quantity, price } = req.body;
  try {
    await pool.query(
      'UPDATE parts SET part_number = $1, name = $2, category = $3, quantity = $4, price = $5 WHERE id = $6',
      [part_number, name, category, quantity, price, id]
    );
    if (quantity < 10) {
      console.log(`Low stock alert: ${name} has ${quantity} units left`);
    }
    res.json({ message: 'Part updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/parts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM parts WHERE id = $1', [id]);
    res.json({ message: 'Part deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/reports/stock', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name, part_number, quantity FROM parts ORDER BY quantity DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
