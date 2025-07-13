import express from 'express';
import redisClient from '../redisclient.js';
import User from '../models/user.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and caching
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (cached with Redis)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   age:
 *                     type: integer
 */
router.get('/', async (req, res) => {
  console.time('Fetch Users');
  const cacheKey = 'all_users';

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log('Serving from Redis');
    console.timeEnd('Fetch Users');
    return res.json(JSON.parse(cached));
  }

  const users = await User.find();
  await redisClient.setEx(cacheKey, 60, JSON.stringify(users)); 

  console.log('Serving from MongoDB and caching');
  console.timeEnd('Fetch Users');
  res.json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user and invalidate cache
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const { name, email, age } = req.body;
  const user = await User.create({ name, email, age });
  await redisClient.del('all_users');
  res.status(201).json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID and invalidate cache
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB user ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).send('User not found');
  await redisClient.del('all_users');
  res.json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID and invalidate cache
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB user ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await redisClient.del('all_users');
  res.status(204).send();
});

export default router;
