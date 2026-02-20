import express from 'express';
import authRoutes from './authRoutes.js';
import articleRoutes from './articleRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import commentRoutes from './commentRoutes.js';

const router = express.Router();

// API v1 routes
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);

export default router;
