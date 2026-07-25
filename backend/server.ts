import express, { Request, Response } from 'express';
import cors from 'cors';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'db.json');

interface PrivateReviewData {
  reviewId: string;
  employeeHash: string;
  reviewerHash: string;
  rating: number;
  strengths: string;
  areasForImprovement: string;
  comments: string;
  goals: string;
  promotionRecommendation: boolean;
  salaryRecommendation: string;
  timestamp: string;
  status: number; // 1 = Submitted, 2 = Acknowledged, 3 = Appealed
  appealMessage?: string;
}

// Helper to load database
function loadDb(): Record<string, PrivateReviewData> {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}));
    return {};
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file, resetting:', err);
    return {};
  }
}

// Helper to save database
function saveDb(db: Record<string, PrivateReviewData>) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Endpoint to fetch all reviews for HR/Admin (only metadata, or status monitoring)
app.get('/api/reviews', (req: Request, res: Response) => {
  const db = loadDb();
  const userHash = req.headers['x-user-hash'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userHash) {
    res.status(400).json({ error: 'Missing x-user-hash header' });
    return;
  }

  const reviews = Object.values(db);

  if (userRole === 'admin' || userRole === 'hr') {
    // HR can monitor status and hashes, but let's scrub the private details
    const hrReviews = reviews.map(r => ({
      reviewId: r.reviewId,
      employeeHash: r.employeeHash,
      reviewerHash: r.reviewerHash,
      status: r.status,
      timestamp: r.timestamp,
    }));
    res.json(hrReviews);
    return;
  }

  // Otherwise, filter by employee or reviewer
  const filtered = reviews.filter(
    r => r.employeeHash === userHash || r.reviewerHash === userHash
  );
  res.json(filtered);
});

// Endpoint to fetch a specific review with full details
app.get('/api/reviews/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userHash = req.headers['x-user-hash'] as string;

  if (!userHash) {
    res.status(400).json({ error: 'Missing x-user-hash header' });
    return;
  }

  const db = loadDb();
  const review = db[id];

  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  // Access control check
  if (review.employeeHash !== userHash && review.reviewerHash !== userHash) {
    res.status(430).json({ error: 'Unauthorized to view this review' });
    return;
  }

  res.json(review);
});

// Endpoint to submit/create a review
app.post('/api/reviews', (req: Request, res: Response) => {
  const reviewData = req.body as PrivateReviewData;

  if (!reviewData.reviewId || !reviewData.employeeHash || !reviewData.reviewerHash) {
    res.status(400).json({ error: 'Missing required review fields' });
    return;
  }

  const db = loadDb();
  if (db[reviewData.reviewId]) {
    res.status(400).json({ error: 'Review ID already exists' });
    return;
  }

  // Set initial status to 1 (Submitted)
  reviewData.status = 1;
  db[reviewData.reviewId] = reviewData;
  saveDb(db);

  res.status(201).json({ success: true, review: reviewData });
});

// Endpoint to acknowledge a review
app.post('/api/reviews/:id/acknowledge', (req: Request, res: Response) => {
  const { id } = req.params;
  const userHash = req.headers['x-user-hash'] as string;

  if (!userHash) {
    res.status(400).json({ error: 'Missing x-user-hash header' });
    return;
  }

  const db = loadDb();
  const review = db[id];

  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  if (review.employeeHash !== userHash) {
    res.status(430).json({ error: 'Only the employee can acknowledge this review' });
    return;
  }

  review.status = 2; // Acknowledged
  db[id] = review;
  saveDb(db);

  res.json({ success: true, review });
});

// Endpoint to appeal a review
app.post('/api/reviews/:id/appeal', (req: Request, res: Response) => {
  const { id } = req.params;
  const { appealMessage } = req.body;
  const userHash = req.headers['x-user-hash'] as string;

  if (!userHash) {
    res.status(400).json({ error: 'Missing x-user-hash header' });
    return;
  }

  if (!appealMessage) {
    res.status(400).json({ error: 'Appeal message is required' });
    return;
  }

  const db = loadDb();
  const review = db[id];

  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  if (review.employeeHash !== userHash) {
    res.status(430).json({ error: 'Only the employee can appeal this review' });
    return;
  }

  review.status = 3; // Appealed
  review.appealMessage = appealMessage;
  db[id] = review;
  saveDb(db);

  res.json({ success: true, review });
});

// Endpoint to update review status (HR workflow)
app.post('/api/reviews/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === undefined) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }

  const db = loadDb();
  const review = db[id];

  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  review.status = status;
  db[id] = review;
  saveDb(db);

  res.json({ success: true, review });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Private Witness Server running on port ${PORT}`);
});
