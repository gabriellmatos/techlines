import dotenv from 'dotenv';
dotenv.config();
import connectToDatabase from './db.js';
import express from 'express';
import cors from 'cors';

// Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import stripeRoute from './routes/stripeRoute.js';
//import orderRoutes from './routes/orderRoutes.js';

connectToDatabase();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checkout', stripeRoute);
//app.use('/api/orders', orderRoutes);

app.get('/api/config/google', (req, res) => res.send(process.env.GOOGLE_CLIENT_ID));

// localhost:5000/api/products
const port = 5000;

app.get('/', (req, res) => {
	res.send('API is running...');
});

app.listen(port, () => {
	console.log(`Server runs on port ${port}`);
});
