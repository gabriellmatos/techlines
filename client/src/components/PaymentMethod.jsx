import { Radio, RadioGroup, VStack } from '@chakra-ui/react';

const PaymentMethod = () => {
	return (
		<RadioGroup defaultValue='1' padding='32px'>
			<VStack gap='6' align='left'>
				<Radio value='1'>Pix</Radio>
				<Radio value='2'>Credit Card</Radio>
			</VStack>
		</RadioGroup>
	);
};

export default PaymentMethod;
