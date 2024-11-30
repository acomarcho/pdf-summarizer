import express from 'express';
import multer from 'multer';
import { SummaryController } from './controllers/summaryController';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const summaryController = new SummaryController();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/summarize', 
  upload.single('pdf'),
  (req, res) => summaryController.summarizePdf(req, res)
);

export default app; 