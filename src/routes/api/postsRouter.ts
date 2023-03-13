import express from 'express';
import * as postsController from '../../controllers/postsController';

const postsRouter = express.Router();

postsRouter.route('/').get(postsController.handleGet).post(postsController.handlePost);

postsRouter.route('/:id').patch(postsController.handlePatch).delete(postsController.handleDelete);

export default postsRouter;
