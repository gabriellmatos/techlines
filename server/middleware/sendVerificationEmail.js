import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const BASE_URL =
	process.env.NODE_ENV === 'production' ? 'https://techlines-ai2s.onrender.com' : 'http://localhost:3000';

export const sendVerificationEmail = (token, email, name) => {
	const html = `
    <html>
        <body>
            <h3>Dear ${name}</h3>
            <p>Thanks for signing up at Tech Lines</p>
            <p>Use the link below to verify your e-mail.</p>
            <a href="${BASE_URL}/verify-email/${token}">Click here!</a>
        </body>
    </html>
    `;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'gabriel.lz.mts@gmail.com',
			pass: 'fjcl cies byhb prud',
		},
	});

	const mailOptions = {
		from: 'gabriel.lz.mts@gmail.com',
		to: email,
		subject: 'Verify your e-mail address.',
		html: html,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(`E-mail sent to ${email}`);
			console.log(info.response);
		}
	});
};
