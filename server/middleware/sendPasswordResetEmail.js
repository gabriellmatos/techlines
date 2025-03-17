import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const BASE_URL =
	process.env.NODE_ENV === 'production' ? 'https://techlines-ai2s.onrender.com' : 'http://localhost:3000';

export const sendPasswordResetEmail = (token, email, name) => {
	const html = `
    <html>
        <body>
          <h3>Dear ${name}</h3>
             <p>Please click on the link below to reset your password.</p>
             <a href="${BASE_URL}/password-reset/${token}">Click here!</a>
        </body>
    </html>`;

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
		subject: 'Tech Lines: Reset your password request.',
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
