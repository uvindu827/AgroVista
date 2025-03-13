import express from 'express';
import { addPost, deletePost, getAllPosts, updatePost } from '../controllers/nfController.js';

const nfRouter = express.Router();

nfRouter.post("/addPost", addPost);
nfRouter.post("/getAllPosts", getAllPosts);
nfRouter.put("/:id", updatePost);
nfRouter.delete("/:id", deletePost);

export default nfRouter;