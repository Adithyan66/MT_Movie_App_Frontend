



const AUTH_TOKEN_KEY = 'accessToken';

export const tokenManager = {
    getToken: (): string | null => {
        try {
            return localStorage.getItem(AUTH_TOKEN_KEY);
        } catch (error) {
            console.error('Failed to get token:', error);
            return null;
        }
    },

    setToken: (token: string): void => {
        try {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
        } catch (error) {
            console.error('Failed to save token:', error);
        }
    },

    removeToken: (): void => {
        try {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        } catch (error) {
            console.error('Failed to remove token:', error);
        }
    },

    hasToken: (): boolean => {
        return !!tokenManager.getToken();
    }
};
