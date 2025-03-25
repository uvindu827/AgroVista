import express from 'express';
import { addPost, adminSearchPosts, deletePost, getAllPosts, getAllreports, reportPost, updatePost } from '../controllers/nfController.js';


const nfRouter = express.Router();

nfRouter.post("/addPost", addPost);
nfRouter.post("/getAllPosts", getAllPosts);
nfRouter.put("/:id", updatePost);
nfRouter.delete("/:id", deletePost);
nfRouter.get("/admin/posts/search", adminSearchPosts);
nfRouter.post("/post/report", reportPost);
nfRouter.post("/getAllReports", getAllreports);


export default nfRouter;