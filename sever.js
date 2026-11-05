const express = require('express');
const fs = require('fs');
const app = express();
const FILE = 'books.json';

app.use(express.json());
app.use(express.static('public'));

const read = () => fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : [];

app.get('/api/books', (req, res) => res.json(read()));

app.post('/api/books', (req, res) => {
  const b = req.body;
  if (!b.t || !b.a) return res.status(400).json({ error: 'title and author required' });
  const books = read();
  const book = {
    id: Math.max(100, ...books.map(x => x.id)) + 1,
    t: b.t, a: b.a, g: b.g || 'Fiction', y: +b.y || 2024, p: +b.p || 0,
    pub: b.pub || '', isbn: b.isbn || '', d: b.d || String(b.y || ''),
    c: b.c || ['#3f7a4a', '#14301b'],
    s: b.s || 'No synopsis yet.',
    dist: [0, 0, 0, 0, 0]
  };
  books.push(book);
  fs.writeFileSync(FILE, JSON.stringify(books, null, 2));
  res.status(201).json(book);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));