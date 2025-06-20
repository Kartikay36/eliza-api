import { Router } from 'express';
import NewsPost from '../models/NewsPost';
import { authenticate, isAdmin } from '../middlewares/auth';

const router = Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await NewsPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new post
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, content, type, videoUrl, tags, featured } = req.body;
    const author = req.user.userId;
    
    const newPost = new NewsPost({
      title,
      content,
      type,
      videoUrl,
      tags,
      featured,
      author
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update post
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const post = await NewsPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.author !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updatedPost = await NewsPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete post
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const post = await NewsPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.author !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await NewsPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
