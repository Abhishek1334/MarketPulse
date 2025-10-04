import User from "../models/user.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.js";

// POST api/auth/register
const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
		    throw createError(400, "All the fields are required.");
		}
		
		if (!validator.isEmail(email)) {
		    throw createError(400, "Invalid email.");
		}
		
		if (existingUser) {
		    throw createError(409, "User already exists.");
		}

		const newUser = new User({ name, email, password });

		await newUser.save();

		const token = jwt.sign(
			{ userId: newUser._id },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		res.status(201).json({
			message: "User registered successfully.",
			token,
			user: {
				id: newUser._id,
				name: newUser.name,
				email: newUser.email,
			},
		});
	} catch (error) {
		console.error(error);
		throw createError(error.statusCode || 500,error.message);
	}
};


// POST api/auth/login
const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw createError(400,"All the fields are required.");
		}

		const user = await User.findOne({ email });

		if (!user) {
			throw createError(404,"User not found.");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw createError(401,"Invalid password.");
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		res.status(200).json({
			message: "User logged in successfully.",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export { registerUser, loginUser };
