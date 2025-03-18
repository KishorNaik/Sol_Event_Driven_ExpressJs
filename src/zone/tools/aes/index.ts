/*
Command:
npx ts-node-dev --inspect=4321 --pretty --transpile-only -r tsconfig-paths/register src/zone/tools/aes/index.ts
*/

import { ENCRYPTION_KEY } from '@/config';
import { AES } from '@/shared/utils/helpers/aes';

//console.log('Hello World!');

// Request Body
// export const requestBody = {
// 	title: 'Shopping groceries',
// 	description: 'Eggs, milk, bread, and cheese',
// };

export const requestBody = {
	fullName: 'Joy',
	email: 'joy@gmail.com',
};

const aes = new AES(ENCRYPTION_KEY);

// Encrypt
const encryptAsync = async (): Promise<void> => {
	const encryptRequestBody = await aes.encryptAsync(JSON.stringify(requestBody));
	console.log('encryptRequestBody: ', encryptRequestBody);
};

// Decrypt
const decryptAsync = async (encryptRequestBody: string): Promise<void> => {
	const decryptRequestBody = await aes.decryptAsync(encryptRequestBody);
	console.log('decryptRequestBody: ', JSON.parse(decryptRequestBody));
};

encryptAsync()
	.then()
	.catch((ex) => console.log('ex: ', ex));

// decryptAsync("80f27271314805e19eea9413c0af9704:72ab93e12c3b3cf9b27373857e814dbcacc87a65668f9caf16b8594d2552b40403ecab17390c72cd76cb73e404a9d24f")
//     .then()
//     .catch((ex)=>console.log("ex:",ex));
