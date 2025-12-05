/**
 * Creates a Jellyfin authorization string from user agent and timestamp
 * @param userAgent - Browser user agent string
 * @param timestamp - Timestamp in milliseconds (defaults to current time)
 * @returns Base64-encoded string in format: userAgent|timestamp
 */
export const createAuthString = (
	userAgent: string,
	timestamp: number = Date.now(),
): string => {
	const combinedString = `${userAgent}|${timestamp}`;
	return btoa(combinedString);
};

/**
 * Decodes a Jellyfin authorization string
 * @param encodedString - Base64-encoded authorization string
 * @returns Object containing userAgent and timestamp
 */
export const decodeAuthString = (
	encodedString: string,
): { userAgent: string; timestamp: number } => {
	const decoded = atob(encodedString);
	const [userAgent, timestampStr] = decoded.split("|");
	return {
		userAgent: userAgent ?? "",
		timestamp: parseInt(timestampStr ?? "0", 10),
	};
};

/**
 * Gets the default Chrome user agent for Windows
 * @returns Chrome user agent string
 */
export const getDefaultUserAgent = (): string => {
	return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
};
