import { Text, Stack, Box, Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendResetEmail } from '../redux/actions/userActions';

const PasswordForgottenForm = () => {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const handleChange = (event) => {
		setEmail(event.target.value);
	};
	return (
		<>
			<Box my='4'>
				<Text as='b'>Enter your e-mail address below.</Text>
				<Text>We'll send you an e-mail with a link to reset your password.</Text>
			</Box>
			<Stack>
				<Input
					mb='4'
					type='text'
					name='email'
					placeholder='Your e-mail address'
					label='E-mail'
					value={email}
					onChange={(e) => handleChange(e)}
				/>
				<Button colorScheme='yellow' size='lg' fontSize='md' onClick={() => dispatch(sendResetEmail(email))}>
					Send reset e-mail
				</Button>
			</Stack>
		</>
	);
};

export default PasswordForgottenForm;
