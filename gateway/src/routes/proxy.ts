import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = express.Router();

router.use('/user', createProxyMiddleware({
    target: 'http://localhost:5001', // user-service
    changeOrigin: true,
}));

router.use('/game', createProxyMiddleware({
    target: 'http://localhost:5002', // game-service
    changeOrigin: true,
}));

router.use('/dictionary', createProxyMiddleware({
    target: 'http://localhost:5002', // game-service
    changeOrigin: true,
}));

router.use('/leaderboard', createProxyMiddleware({
    target: 'http://localhost:5002', // game-service
    changeOrigin: true,
}));

export default router;
