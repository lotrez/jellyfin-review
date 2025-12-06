import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthenticateByNameResponse, PublicUserResponse } from "../../back/jellyfin/jellyfin-model";
import {
	login as jellyfinLogin,
	userUsageRank,
	getPublicUsers,
	getUserMostViewedShow,
} from "../../back/jellyfin/jellyfin-client";

interface UsageRankData {
	userId: string;
	totalDuration: number;
	totalPlays: number;
	averageDuration: number;
}

interface MostViewedShowData {
	showName: string;
	playCount: number;
	totalDuration: number;
}

interface JellyfinStats {
	usageRank: UsageRankData[] | undefined;
	publicUsers: { status: number; data: PublicUserResponse[] } | undefined;
	mostViewedShow: MostViewedShowData | null | undefined;
	isLoading: boolean;
	errors: {
		usageRank: Error | null;
		publicUsers: Error | null;
		mostViewedShow: Error | null;
	};
}

interface JellyfinContextType {
	serverUrl: string | null;
	accessToken: string | null;
	userId: string | null;
	user: AuthenticateByNameResponse["User"] | null;
	login: (credentials: { username: string; password: string; serverUrl: string }) => Promise<void>;
	logout: () => void;
	isLoggingIn: boolean;
	loginError: Error | null;
	stats: JellyfinStats;
}

const JellyfinContext = createContext<JellyfinContextType | undefined>(undefined);

const STORAGE_KEYS = {
	SERVER_URL: 'jellyfin_server_url',
	ACCESS_TOKEN: 'jellyfin_access_token',
	USER_ID: 'jellyfin_user_id',
	USER: 'jellyfin_user',
} as const;

export const JellyfinProvider = ({ children }: { children: ReactNode }) => {
	// Initialize state from sessionStorage
	const [serverUrl, setServerUrl] = useState<string | null>(() => {
		if (typeof window !== 'undefined') {
			const stored = sessionStorage.getItem(STORAGE_KEYS.SERVER_URL);
			console.log('[Jellyfin] Restoring serverUrl from sessionStorage:', stored);
			return stored;
		}
		return null;
	});
	
	const [accessToken, setAccessToken] = useState<string | null>(() => {
		if (typeof window !== 'undefined') {
			const stored = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			console.log('[Jellyfin] Restoring accessToken from sessionStorage:', stored ? stored.substring(0, 10) + '...' : null);
			return stored;
		}
		return null;
	});
	
	const [userId, setUserId] = useState<string | null>(() => {
		if (typeof window !== 'undefined') {
			const stored = sessionStorage.getItem(STORAGE_KEYS.USER_ID);
			console.log('[Jellyfin] Restoring userId from sessionStorage:', stored);
			return stored;
		}
		return null;
	});
	
	const [user, setUser] = useState<AuthenticateByNameResponse["User"] | null>(() => {
		if (typeof window !== 'undefined') {
			const storedUser = sessionStorage.getItem(STORAGE_KEYS.USER);
			if (storedUser) {
				try {
					const parsed = JSON.parse(storedUser) as AuthenticateByNameResponse["User"];
					console.log('[Jellyfin] Restoring user from sessionStorage:', parsed.Name);
					return parsed;
				} catch (error) {
					console.error('[Jellyfin] Failed to parse stored user:', error);
					return null;
				}
			}
		}
		return null;
	});

	const isAuthenticated = !!(serverUrl && accessToken);

	// Helper to update state and sessionStorage together
	const updateServerUrl = (url: string | null) => {
		console.log('[Jellyfin] updateServerUrl:', url);
		setServerUrl(url);
		if (url) {
			sessionStorage.setItem(STORAGE_KEYS.SERVER_URL, url);
		} else {
			sessionStorage.removeItem(STORAGE_KEYS.SERVER_URL);
		}
	};

	const updateAccessToken = (token: string | null) => {
		console.log('[Jellyfin] updateAccessToken:', token ? token.substring(0, 10) + '...' : null);
		setAccessToken(token);
		if (token) {
			sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
		} else {
			sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
		}
	};

	const updateUserId = (id: string | null) => {
		console.log('[Jellyfin] updateUserId:', id);
		setUserId(id);
		if (id) {
			sessionStorage.setItem(STORAGE_KEYS.USER_ID, id);
		} else {
			sessionStorage.removeItem(STORAGE_KEYS.USER_ID);
		}
	};

	const updateUser = (userData: AuthenticateByNameResponse["User"] | null) => {
		console.log('[Jellyfin] updateUser:', userData?.Name);
		setUser(userData);
		if (userData) {
			sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
		} else {
			sessionStorage.removeItem(STORAGE_KEYS.USER);
		}
	};

	const loginMutation = useMutation({
		mutationFn: async ({ username, password, serverUrl }: { username: string; password: string; serverUrl: string }) => {
			console.log('[Jellyfin] Login attempt:', { username, serverUrl });
			
			const response = await jellyfinLogin({
				login: username,
				pw: password,
				url: serverUrl,
			});

			console.log('[Jellyfin] Login response:', { 
				status: response.status,
				hasData: !!response.data,
				serverId: response.data?.ServerId,
				accessToken: response.data?.AccessToken?.substring(0, 10) + '...',
			});

			if (response.status !== 200) {
				console.error('[Jellyfin] Login failed with status:', response.status);
				throw new Error("Login failed");
			}

			return { ...response, requestedServerUrl: serverUrl };
		},
		onSuccess: (response) => {
			console.log('[Jellyfin] Login successful, saving auth data:', {
				serverUrl: response.requestedServerUrl,
				serverId: response.data.ServerId,
				userId: response.data.User.Id,
				userName: response.data.User.Name,
			});
			
			// Save the actual server URL that was used for login, not the ServerId
			updateServerUrl(response.requestedServerUrl);
			updateAccessToken(response.data.AccessToken);
			updateUserId(response.data.User.Id);
			updateUser(response.data.User);
			
			console.log('[Jellyfin] Auth data saved to sessionStorage');
		},
	});

	const login = async (credentials: { username: string; password: string; serverUrl: string }) => {
		console.log('[Jellyfin] Login called with credentials:', { 
			username: credentials.username,
			serverUrl: credentials.serverUrl,
			hasPassword: !!credentials.password,
		});
		await loginMutation.mutateAsync(credentials);
	};

	const logout = () => {
		console.log('[Jellyfin] Logging out, clearing all auth data');
		updateServerUrl(null);
		updateAccessToken(null);
		updateUserId(null);
		updateUser(null);
	};

	// Use the stats hook
	const stats = useJellyfinStats(serverUrl, accessToken, userId);

	const value: JellyfinContextType = {
		serverUrl,
		accessToken,
		userId,
		user,
		login,
		logout,
		isLoggingIn: loginMutation.isPending,
		loginError: loginMutation.error,
		stats,
	};

	return (
		<JellyfinContext.Provider value={value}>{children}</JellyfinContext.Provider>
	);
};

export const useJellyfin = () => {
	const context = useContext(JellyfinContext);
	if (context === undefined) {
		throw new Error("useJellyfin must be used within a JellyfinProvider");
	}
	return context;
};

// Hook that groups all Jellyfin stats queries
function useJellyfinStats(
	serverUrl: string | null,
	accessToken: string | null,
	userId: string | null
): JellyfinStats {
	const isAuthenticated = !!(serverUrl && accessToken);

	// Query: User Usage Rank - only runs when authenticated
	const usageRankQuery = useQuery({
		queryKey: ["userUsageRank", serverUrl, accessToken],
		queryFn: async () => {
			if (!serverUrl || !accessToken) {
				throw new Error("Not authenticated");
			}
			return await userUsageRank({ auth: accessToken, url: serverUrl });
		},
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Query: Public Users - only runs when server URL is available
	const publicUsersQuery = useQuery({
		queryKey: ["publicUsers", serverUrl],
		queryFn: async () => {
			if (!serverUrl) {
				throw new Error("Server URL not set");
			}
			return await getPublicUsers({ url: serverUrl });
		},
		enabled: !!serverUrl,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});

	// Query: Most Viewed Show - only runs when authenticated and userId is available
	const mostViewedShowQuery = useQuery({
		queryKey: ["mostViewedShow", serverUrl, accessToken, userId],
		queryFn: async () => {
			if (!serverUrl || !accessToken || !userId) {
				throw new Error("Not authenticated or no user ID");
			}
			return await getUserMostViewedShow({
				auth: accessToken,
				url: serverUrl,
				userId: userId,
			});
		},
		enabled: isAuthenticated && !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	return {
		usageRank: usageRankQuery.data,
		publicUsers: publicUsersQuery.data,
		mostViewedShow: mostViewedShowQuery.data,
		isLoading: usageRankQuery.isLoading || publicUsersQuery.isLoading || mostViewedShowQuery.isLoading,
		errors: {
			usageRank: usageRankQuery.error,
			publicUsers: publicUsersQuery.error,
			mostViewedShow: mostViewedShowQuery.error,
		},
	};
}
