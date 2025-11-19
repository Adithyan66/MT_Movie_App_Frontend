import httpClient from './httpClient';
import { API_ENDPOINTS } from '../constants/api';

export interface GoogleLoginResponse {
	success: boolean;
	message: string;
	data: {
		user: {
			id: string;
			userName: string;
			email: string;
			profilePicUrl: string;
			accessToken: string;
			refreshToken: string;
		};
	};
}

export const authApi = {
	googleLogin: async (token: string): Promise<GoogleLoginResponse> => {
		const response = await httpClient.post(API_ENDPOINTS.AUTH.GOOGLE_CALLBACK, {
			token,
		});
		return response.data;
	},
};

