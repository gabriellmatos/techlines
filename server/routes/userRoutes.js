import express from 'express';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../middleware/sendVerificationEmail.js';
import { sendPasswordResetEmail } from '../middleware/sendPasswordResetEmail.js';

const userRoutes = express.Router();

// TODO: Redefine expiresIn
const genToken = (id) => {
	return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '60d' });
};

// Login
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (user && (await user.matchPasswords(password))) {
		user.firstLogin = false;
		await user.save();
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			googleImage: user.googleImage,
			googleId: user.googleId,
			isAdmin: user.isAdmin,
			token: genToken(user._id),
			active: user.active,
			firstLogin: user.firstLogin,
			created: user.createdAt,
		});
	} else {
		res.status(401).send('Invalid Email or Password.');
		throw new Error('User not found.');
	}
});

// Register
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400).send('We already have an account with that e-mail address.');
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	const newToken = genToken(user._id);

	sendVerificationEmail(newToken, email, name);

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			googleImage: user.googleImage,
			googleId: user.googleId,
			firstLogin: user.firstLogin,
			isAdmin: user.isAdmin,
			token: newToken,
			active: user.active,
			createdAt: user.createdAt,
		});
	} else {
		res.status(400).send('We could not register you.');
		throw new Error('Something went wrong. Please, check your information and try again.');
	}
});

// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

		const user = await User.findById(decoded.id);

		if (user) {
			user.active = true;
			await user.save();
			// Optional message.
			res.json('Thanks for activating your account. You can close this window now.');
		} else {
			res.status(404).send('User not found.');
		}
	} catch (error) {
		res.status(401).send('E-mail address could not be verified.');
	}
});

// Password Reset Request
const passwordResetRequest = asyncHandler(async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (user) {
			const newToken = genToken(user._id);
			sendPasswordResetEmail(newToken, user.email, user.name);
			res.status(200).send(`We have sent you a recover email to ${email}`);
		}
	} catch (error) {
		response.status(401).send('There is no account with the e-mail address.');
	}
});

// Password Reset
const passwordReset = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await User.findById(decoded.id);

		if (user) {
			user.password = req.body.password;
			await user.save();
			res.json('Your password has been updated successfully.');
		} else {
			res.status(404).send('User not found.');
		}
	} catch (error) {
		res.status(401).send('Password reset failed.');
	}
});

// Google Login
const googleLogin = asyncHandler(async (req, res) => {
	const { googleId, email, name, googleImage } = req.body;

	try {
		const user = await User.findOne({ googleId: googleId });
		if (user) {
			user.firstLogin = false;
			await user.save();
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				googleImage: user.googleImage,
				googleId: user.googleId,
				firstLogin: user.firstLogin,
				isAdmin: user.isAdmin,
				token: genToken(user._id),
				active: user.active,
				createdAt: user.createdAt,
			});
		} else {
			const newUser = await User.create({
				name,
				email,
				googleImage,
				googleId,
			});
			const newToken = genToken(newUser._id);
			sendVerificationEmail(newToken, newUser.email, newUser.name, newUser._id);
			res.json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				googleImage: newUser.googleImage,
				googleId: newUser.googleId,
				firstLogin: newUser.firstLogin,
				isAdmin: newUser.isAdmin,
				token: genToken(newUser._id),
				active: newUser.active,
				createdAt: newUser.createdAt,
			});
		}
	} catch (error) {
		res.status(404).send('Something went wrong. Please, try again later.');
	}
});

// POST
userRoutes.route('/login').post(loginUser);
userRoutes.route('/register').post(registerUser);
userRoutes.route('/verify-email').get(verifyEmail);
userRoutes.route('/password-reset-request').post(passwordResetRequest);
userRoutes.route('/password-reset').post(passwordReset);
userRoutes.route('/google-login').post(googleLogin);

export default userRoutes;
