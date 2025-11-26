import crypto from 'node:crypto';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

const JWT_SECRET_KEY = crypto.randomBytes(32).toString('hex');

interface User {
  id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
};

const users: User[] = [];

app.post('/v1/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req?.body?.email;
    const password = req?.body?.password;
    const role = req?.body?.role;
    const passwordHash = await bcrypt.hash(password, 12);
    const user: User = {
      id: crypto.randomUUID(),
      email,
      password: passwordHash,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    return res.status(201).json({ id: user.id });
  } catch (err) {
    next(err);
  }
});

app.post('/v1/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req?.body?.email;
    const password = req?.body?.password;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const payload = { sub: user.id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '5m' });
    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

app.get('/v1/ping', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'User Ping!' });
});

app.get('/v1/admin', authenticate, requireRole('admin'), async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'Admin Ping!' });
});

app.use((req: Request, res: Response) => {
  return res.sendStatus(404);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.sendStatus(500);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Auth service started on http://localhost:${port}`);
});

function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req?.headers?.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    res.locals.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (user.role !== role) return res.sendStatus(403);
    next();
  };
}
