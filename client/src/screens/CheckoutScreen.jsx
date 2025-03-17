import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link as ReactLink, useLocation } from 'react-router-dom';
import ShippingInformation from '../components/ShippingInformation';
import PaymentMethod from '../components/PaymentMethod';
import { setPayment } from '../redux/actions/orderActions';

const CheckoutScreen = () => {
	const { userInfo } = useSelector((state) => state.user);
	const { subtotal, shipping } = useSelector((state) => state.cart);
	const location = useLocation();
	const dispatch = useDispatch();

	const onSubmit = async (values) => {
		dispatch(setPayment());
	};

	return userInfo ? (
		<Box
			minH='100vh'
			maxW={{ base: '3xl', lg: '7xl' }}
			mx='auto'
			px={{ base: '4', md: '8', lg: '12' }}
			py={{ base: '6', md: '8', lg: '12' }}
		>
			<Stack spacing='8' direction={{ base: 'column', lg: 'row' }} align={{ base: 'revert', lg: 'flex-start' }}>
				<Stack spacing={{ base: '8', md: '10' }} flex='1.5' mb={{ base: '12', md: 'none' }}>
					<Heading fontSize='2xl' fontWeight='extrabold'>
						Paying Method
					</Heading>
					<Stack>
						{/* <ShippingInformation /> */}
						<PaymentMethod />
					</Stack>
				</Stack>
				<Flex direction='column' align='center' flex='1'>
					<Stack
						minWidth='300px'
						spacing='8'
						borderWidth='1px'
						borderColor={'cyan.500'}
						rounded='lg'
						padding='8'
						w='full'
					>
						<Heading size='md'>Order Summary</Heading>
						<Stack spacing='6'>
							<Flex justify='space-between'>
								<Text fontSize='xl' fontWeight='bold'>
									Total
								</Text>
								<Text fontWeight='medium'>${Number(subtotal)}</Text>
							</Flex>
						</Stack>
						<Button
							as={ReactLink}
							to='/payment/'
							colorScheme='cyan'
							size='lg'
							rightIcon={<FaArrowRight />}
							onClick={() => onSubmit}
						>
							Proceed to Payment
						</Button>
					</Stack>
				</Flex>
			</Stack>
		</Box>
	) : (
		<Navigate to='/login' replace={true} state={{ from: location }} />
	);
};

export default CheckoutScreen;
