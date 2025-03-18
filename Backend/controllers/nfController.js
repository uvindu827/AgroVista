import nfPost from "../models/newsfeedModel.js";
import mongoose from "mongoose";
import postReport from "../models/postReportModel.js";

//System manager functionalities of the newsfeed

export const addPost = async (req, res) => {

    try{
        const {title, content, image, keywords} = req.body;

        if(!title || !content || !image){
            return res.status(400).json({message:"Missing required fields"});
        }

        const newPost = new nfPost({
            title,
            content, 
            image,
            keywords: keywords || []
        });

        await newPost.save();

        res.status(201).json({
            data: {
                id: newPost._id,
                title: newPost.title,
                content: newPost.content,
                keyword: newPost.keywords,
                createdAt: newPost.createdAt
            }
        });
    }catch(error){
        console.error("Post creation error:", error);
        res.status(500).json({ error: "Server error" });
    }   
};

export const getAllPosts = async(req, res) => {
    try{
        const posts = await nfPost.find({}).sort({ createdAt: -1 });

        // res.status(200).json({posts});
        
        res.status(200).json({
            count: posts.length,
            data: posts.map(post => ({
                id: post._id,
                title: post.title,
                content: post.content,
                image: post.image,
                keywords: post.keywords,
                createdAt: post.createdAt
            }))
        });
    } catch(error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Validate post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        // Find the existing post
        const existingPost = await nfPost.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Extract fields from request body
        const { title, content, image, keywords } = req.body;

        // Update allowed fields if provided
        if (title !== undefined) 
            existingPost.title = title;
        if (content !== undefined) 
            existingPost.content = content;
        if (image !== undefined) 
            existingPost.image = image;
        if (keywords !== undefined) 
            existingPost.keywords = keywords;

        // Update the timestamp
        existingPost.updatedAt = new Date();

        // Save the updated post
        await existingPost.save();

        // Return the updated post data
        res.status(200).json({
            data: {
                id: existingPost._id,
                title: existingPost.title,
                content: existingPost.content,
                image: existingPost.image,
                keywords: existingPost.keywords,
                createdAt: existingPost.createdAt,
                updatedAt: existingPost.updatedAt
            }
        });

    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error("Update post error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Validate post ID format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        // Find and delete the post
        const deletedPost = await nfPost.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Return success response with deleted post ID
        res.status(200).json({
            data: {
                id: deletedPost._id,
                message: "Post deleted successfully",
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const adminSearchPosts = async (req, res) => {
    try {
        const { search } = req.query; // Single search parameter

        let filter = {};

        if (search) {
            filter.$or = [
                // Check if the search term is a keyword (exact match)
                { keywords: { $in: [search] } },
                
                // Partial match in title or content
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await nfPost.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            count: posts.length,
            data: posts.map(post => ({
                id: post._id,
                title: post.title,
                contentSnippet: post.content.substring(0, 10),
                keywords: post.keywords,
                createdAt: post.createdAt
            }))
        });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


//Newsfeed viewers functionalities

export const reportPost = async(req, res) => {
    try{
        const{postID, reason} = req.body;

        if(!mongoose.Types.ObjectId.isValid(postID)){
            return res.status(400).json({message:"Invalid post ID"});
        }

        const post = await nfPost.findById(postID);
        if(!post){
            return res.status(404).json({message:"Post not fount"});
        }

        const newPostReport = new postReport({postID, reason});
        await newPostReport.save();

        res.status(201).json({
            message: "Report submitted successfully",
            data:{
                postID: newPostReport.postID,
                reason: newPostReport.reason
            }
        });
    }catch(error){
        console.error("Report creation error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getAllreports = async(req, res) => {
    try{
        const postReports = await postReport.find({}).sort({createdAt:1});

        res.status(200).json({
            count: postReports.length,
            data: postReports.map(reports => ({
                id: reports._id,
                postID: reports.postID,
                reason: reports.reason 
            }))
        });

    }catch(error){

    }
};