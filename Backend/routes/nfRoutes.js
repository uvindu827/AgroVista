import express from 'express';
import { addPost, 
    SearchPosts, 
    deletePost, 
    getAllPosts, 
    getAllreports, 
    reportPost, 
    updatePost, 
    getPostById,
    deleteReport} from '../controllers/nfController.js';
import { parser } from '../config/cloudinary.js';


const nfRouter = express.Router();

nfRouter.post("/addPost", parser.single('image'), addPost);
nfRouter.post("/getAllPosts", getAllPosts);
nfRouter.put("/:id", parser.single('image'), updatePost);
nfRouter.delete("/:id", deletePost);
nfRouter.get("/:id/getPostById",getPostById);
nfRouter.get("/admin/posts/search", parser.single('image'), SearchPosts);
nfRouter.post("/post/report", reportPost);
nfRouter.post("/getAllReports", getAllreports);
nfRouter.delete("/deleteReport/:id", deleteReport);


export default nfRouter;