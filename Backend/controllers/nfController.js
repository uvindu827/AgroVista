import nfPost from "../models/newsfeedModel.js";
import mongoose from "mongoose";
import postReport from "../models/postReportModel.js";

//System manager functionalities of the newsfeed

export const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file?.path; // Assuming the image is uploaded and its path is available in req.file.path
    const keywords = req.body.keywords?.split(",").map((k) => k.trim()) || [];

    if (!title || !content || !image || keywords.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPost = new nfPost({
      title,
      content,
      image,
      keywords: keywords || [],
    });

    await newPost.save();

    res.status(201).json({
      data: {
        id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        image: newPost.image,
        keyword: newPost.keywords,
        createdAt: newPost.createdAt,
      },
    });
  } catch (err) {
    console.error("Submit Error:", err.response?.data || err.message);
    setError(err.response?.data?.error || "Failed to create post");
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await nfPost.find({}).sort({ createdAt: -1 });

    // res.status(200).json({posts});

    res.status(200).json({
      count: posts.length,
      data: posts.map((post) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        image: post.image,
        keywords: post.keywords,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        upvotedUsers: post.upvotedUsers,
        upvoteCount: post.upvoteCount,
      })),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const image = req.file?.path;

    let keywords = [];

    try {
      if (typeof req.body.keywords === "string") {
        keywords = req.body.keywords.split(",").map((k) => k.trim());
      } else if (Array.isArray(req.body.keywords)) {
        keywords = req.body.keywords
          .flat()
          .map((k) => k.replace(/"/g, "").trim());
      }
    } catch (error) {
      console.error("Keyword parsing error:", error);
    }

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(image && { image }),
      ...(keywords.length > 0 && { keywords }),
      updatedAt: new Date(),
    };

    const updatedPost = await nfPost.findByIdAndUpdate(postId, updateData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      data: {
        id: updatedPost._id,
        title: updatedPost.title,
        content: updatedPost.content,
        image: updatedPost.image,
        keywords: updatedPost.keywords,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const deletedPost = await nfPost.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      data: {
        id: deletedPost._id,
        message: "Post deleted successfully",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const adminSearchPosts = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { keywords: { $in: [search] } },

        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await nfPost.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: posts.length,
      data: posts.map((post) => ({
        id: post._id,
        title: post.title,
        contentSnippet: post.content.substring(0, 10),
        keywords: post.keywords,
        createdAt: post.createdAt,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const foundPost = await nfPost.findById(postId);

    if (!foundPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      data: {
        id: foundPost._id,
        title: foundPost.title,
        content: foundPost.content,
        image: foundPost.image,
        keywords: foundPost.keywords,
        createdAt: foundPost.createdAt,
        updatedAt: foundPost.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Newsfeed viewers functionalities

export const reportPost = async (req, res) => {
  try {
    const { postID, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postID)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await nfPost.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not fount" });
    }

    const newPostReport = new postReport({ postID, reason });
    await newPostReport.save();

    res.status(201).json({
      message: "Report submitted successfully",
      data: {
        postID: newPostReport.postID,
        reason: newPostReport.reason,
      },
    });
  } catch (error) {
    console.error("Report creation error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllreports = async (req, res) => {
  try {
    const postReports = await postReport.find({}).sort({ createdAt: 1 });

    res.status(200).json({
      count: postReports.length,
      data: postReports.map((reports) => ({
        id: reports._id,
        postID: reports.postID,
        reason: reports.reason,
      })),
    });
  } catch (error) {}
};
