import dotenv from 'dotenv';
dotenv.config();

import configCredentials from '../credentials.js';
import EfiPay from 'sdk-node-apis-efi';
import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const createChargeRoute = express.Router();

const efipay = new EfiPay(configCredentials);

const chargeRoute = async (req, res) => {
	const data = req.body;

	let totalAmount = 0.0;

	if (data.cartItems) {
		data.cartItems.forEach((item) => {
			totalAmount = totalAmount + item.price * item.qty;
		});
	}

	// const order = new Order({
	// 	orderItems: data.cartItems,
	// 	user: data.userInfo._id,
	// 	username: data.userInfo.name,
	// 	email: data.userInfo.email,
	// 	total: totalAmount,
	// });

	// const newOrder = await order.save();

	data.cartItems.forEach(async (cartItem) => {
		let product = await Product.findById(cartItem.id);
		product.stock = product.stock - cartItem.qty;
		product.save();
	});

	const body = {
		calendario: {
			expiracao: 3600,
		},
		valor: {
			original: totalAmount.toFixed(2),
		},
		chave: process.env.PIX_KEY, // Informe sua chave Pix cadastrada na efipay.
		infoAdicionais: [
			{
				nome: 'Pagamento em',
				valor: 'NOME DO SEU ESTABELECIMENTO',
			},
			{
				nome: 'Pedido',
				valor: 'NUMERO DO PEDIDO DO CLIENTE',
			},
		],
	};

	try {
		const order = new Order({
			orderItems: data.cartItems,
			user: data.userInfo._id,
			username: data.userInfo.name,
			email: data.userInfo.email,
			total: totalAmount,
			paymentMethod: {
				paymentType: 'pix',
				orderPaid: false,
			},
		});

		const newOrder = await order.save();

		// Cria a cobrança imediata
		const response = await efipay.pixCreateImmediateCharge({}, body);

		const params = {
			id: response.loc.id,
		};

		// Gera o QRCode da cobrança
		const qrCodeResponse = await efipay.pixGenerateQRCode(params);

		// Update order with payment details
		newOrder.paymentMethod.qrCode = qrCodeResponse.qrcode;
		await newOrder.save();

		// Retorna o QRCode e informações relevantes para o cliente
		res.json({
			message: 'Cobrança criada com sucesso',
			chargeId: response.loc.id,
			qrCode: qrCodeResponse.qrcode,
			qrCodeImage: qrCodeResponse.imagemQrcode,
		});
	} catch (error) {
		res.json(error);
		throw new Error('Erro ao criar cobrança');
	}
};

createChargeRoute.route('/').post(chargeRoute);

export default chargeRoute;
