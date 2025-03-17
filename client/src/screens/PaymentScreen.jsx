import { Button, useToast, Text, Heading, Container, Box, Skeleton, VStack } from '@chakra-ui/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';

const PaymentScreen = () => {
	const [qrCode, setQrCode] = useState(null);
	const [qrCodeImage, setQrCodeImage] = useState(null);
	const [clicked, setClicked] = useState(false);
	const [loading, setLoading] = useState(true);

	const toast = useToast();

	const { userInfo } = useSelector((state) => state.user);
	const { cartItems } = useSelector((state) => state.cart);

	const BASE_URL =
		process.env.NODE_ENV === 'production' ? 'https://techlines-ai2s.onrender.com' : 'http://localhost:5000';

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`${BASE_URL}/api/payment`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						userInfo,
						cartItems,
					}),
				});

				if (response.ok) {
					const data = await response.json();
					console.log(data);

					setQrCode(data.qrCode);
					setQrCodeImage(data.qrCodeImage);
				} else {
					console.error('Error');
				}
			} catch (error) {
				console.error('Error');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<Box px='4' py='8'>
			<VStack gap='4'>
				<Container maxW='6xl'>
					<Heading size='md' py='5'>
						Payment Screen
					</Heading>
					<Skeleton isLoaded={!loading} height='50px' rounded='md'>
						<Box
							borderRadius='8px 8px 0 0'
							borderWidth='1px'
							cursor='pointer'
							onClick={() => {
								setClicked(true);
								navigator.clipboard.writeText(qrCode);
								toast({
									description: 'QR Code copied to clipboard',
									status: 'info',
									duration: 3000,
									colorScheme: 'cyan',
								});
							}}
						>
							{qrCode}
						</Box>
					</Skeleton>

					<Button
						w='100%'
						borderRadius='0 0 8px 8px'
						isLoading={loading}
						onClick={() => {
							setClicked(true);
							navigator.clipboard.writeText(qrCode);
							toast({
								description: 'QR Code copied to clipboard',
								status: 'info',
								duration: 3000,
								colorScheme: 'cyan',
							});
						}}
					>
						{clicked ? <FaCheck /> : 'Copy to clipboard'}
					</Button>
				</Container>
				<Skeleton isLoaded={!loading} height='250px' width='200px' rounded='md'>
					<Text>or pay by scanning the QR Code below:</Text>
					<img src={qrCodeImage} alt='' />
				</Skeleton>
			</VStack>
		</Box>
	);
};

export default PaymentScreen;
