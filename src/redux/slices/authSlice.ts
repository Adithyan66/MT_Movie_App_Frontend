import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';
import { tokenManager } from '../../utils/tokenManager';


export interface AuthUser {
	id: string;
	username: string;
	email: string;
    profilePic:string;
}

export interface AuthState {
	token: any;
	user: AuthUser | null;
	accessToken: string | null;
	refreshToken: string | null;
}

const AUTH_KEY = import.meta.env.VITE_AUTH_KEY;

function readInitialState(): AuthState {
	try {
		const raw = localStorage.getItem(AUTH_KEY);
		if (raw) {
			const state = JSON.parse(raw) as AuthState;
			if (state.accessToken) {
				tokenManager.setToken(state.accessToken);
			}
			return state;
		}
	} catch {
		// ignore
	}
	return { user: null, token: null, accessToken: null, refreshToken: null };
}

const initialState: AuthState = readInitialState();

export const googleLogin = createAsyncThunk(
	'auth/googleLogin',
	async (token: string, { rejectWithValue }) => {
		try {
			const data = await authApi.googleLogin(token);
			return data;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Authentication failed'
			);
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials(
			state,
			action: PayloadAction<{
				user: AuthUser;
				accessToken: string;
				refreshToken: string;
			}>,
		) {
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			tokenManager.setToken(action.payload.accessToken);
			try {
				localStorage.setItem(AUTH_KEY, JSON.stringify(state));
			} catch {}
		},
		updateTokens(
			state,
			action: PayloadAction<{
				accessToken: string;
				refreshToken: string;
			}>,
		) {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			tokenManager.setToken(action.payload.accessToken);
			try {
				localStorage.setItem(AUTH_KEY, JSON.stringify(state));
			} catch {}
		},
		logout(state) {
			state.user = null;
			state.token = null;
			state.accessToken = null;
			state.refreshToken = null;
			tokenManager.removeToken();
			try {
				localStorage.removeItem(AUTH_KEY);
			} catch {}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(googleLogin.pending, () => {
			})
			.addCase(googleLogin.fulfilled, (state, action) => {
				const backendUser = action.payload.data?.user;
				if (backendUser && backendUser.accessToken && backendUser.refreshToken) {
					state.user = {
						id: backendUser.id,
						username: backendUser.userName,
						email: backendUser.email,
						profilePic: backendUser.profilePicUrl,
					};
					state.accessToken = backendUser.accessToken;
					state.refreshToken = backendUser.refreshToken;
					tokenManager.setToken(backendUser.accessToken);
					try {
						localStorage.setItem(AUTH_KEY, JSON.stringify(state));
					} catch {}
				}
			})
			.addCase(googleLogin.rejected, (_state, action) => {
				console.error('Google login failed:', action.payload);
			});
	},
});

export const { setCredentials, updateTokens, logout } = authSlice.actions;
export default authSlice.reducer;









