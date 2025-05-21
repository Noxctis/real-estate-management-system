// apps/api/controllers/post.controller.js

import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import axios from "axios";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city:   query.city    || undefined,
        type:   query.type    || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId (24 hex chars)
  if (!id || typeof id !== "string" || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  try {
    // 1. Fetch the post with its details and author info
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2. Default isSaved to false
    let isSaved = false;

    // 3. If there's a token, verify it and check saved status
    const token = req.cookies?.token;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              userId: payload.id,
              postId: id,
            },
          },
        });
        isSaved = Boolean(saved);
      } catch (jwtErr) {
        // Invalid token — ignore and leave isSaved = false
      }
    }

    // 4. Send a single response
    return res.status(200).json({ ...post, isSaved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    // Remove likePost from postDetail if present
    const postDetail = { ...body.postDetail };
    if ('likePost' in postDetail) delete postDetail.likePost;
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: postDetail,
        },
      },
    });
    return res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { postData, postDetail } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId !== tokenUserId) return res.status(403).json({ message: "Not Authorized!" });

    // Update Post
    await prisma.post.update({
      where: { id },
      data: postData,
    });

    // Update PostDetail (assume one-to-one)
    await prisma.postDetail.updateMany({
      where: { postId: id },
      data: postDetail,
    });

    return res.status(200).json({ message: "Post updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Delete all related SavedPost records first
    await prisma.savedPost.deleteMany({ where: { postId: id } });
    // Delete related PostDetail
    await prisma.postDetail.deleteMany({ where: { postId: id } });
    // Then delete the Post
    await prisma.post.delete({ where: { id } });
    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};

export const searchPosts = async (req, res) => {
  const { q } = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } }
        ]
      },
      select: { id: true, title: true, address: true }
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to search posts!" });
  }
};

export const marketAnalysis = async (req, res) => {
  const { address } = req.query;
  if (!address || typeof address !== "string" || address.trim().length < 3) {
    return res.status(400).json({ message: "Address required (min 3 characters)" });
  }
  try {
    // Geocode address to get city (or lat/lng for more advanced search)
    // For now, just use city substring match
    // Optionally, you can use Google Maps API here for more precise geocoding
    const posts = await prisma.post.findMany({
      where: {
        address: { contains: address, mode: "insensitive" }
      }
    });
    if (!posts.length) return res.json({ count: 0, avgPrice: 0 });
    const avgPrice = posts.reduce((sum, p) => sum + (p.price || 0), 0) / posts.length;
    res.json({ count: posts.length, avgPrice, posts });
  } catch (err) {
    res.status(500).json({ message: "Failed to get market analysis" });
  }
};
