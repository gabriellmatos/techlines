import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = (token, email, name) => {
	const html = `
    <html>
        <body>
          <h3>Dear ${name}</h3>
             <p>Please click on the link below to reset your password.</p>
             <a href="http://localhost:3000/password-reset/${token}">Click here!</a>
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
