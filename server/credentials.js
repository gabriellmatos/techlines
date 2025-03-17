import dotenv from 'dotenv';
dotenv.config();

const configCredentials = {
	// PRODUÇÃO = false
	// HOMOLOGAÇÃO = true
	sandbox: true,
	client_id: process.env.SANDBOX_CLIENT_ID,
	client_secret: process.env.SANDBOX_CLIENT_SECRET,
	certificate: './server/pix/homologacao.p12',
};

export default configCredentials;
