import express from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/', submitFeedback);

export default feedbackRouter;
