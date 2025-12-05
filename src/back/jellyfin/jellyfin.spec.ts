import { describe, expect, test } from "bun:test";
import { login } from "./jellyfin-client";

// Load environment variables
const JELLYFIN_URL = process.env.JELLYFIN_URL;
const JELLYFIN_LOGIN = process.env.JELLYFIN_LOGIN;
const JELLYFIN_PASSWORD = process.env.JELLYFIN_PASSWORD;

describe("Jellyfin Client", () => {
	describe("login", () => {
		test("should return 200 status on successful authentication", async () => {
			if (!JELLYFIN_URL || !JELLYFIN_LOGIN || !JELLYFIN_PASSWORD) {
				throw new Error(
					"Missing required environment variables: JELLYFIN_URL, JELLYFIN_LOGIN, JELLYFIN_PASSWORD",
				);
			}

			const response = await login({
				url: JELLYFIN_URL,
				login: JELLYFIN_LOGIN,
				pw: JELLYFIN_PASSWORD,
			});

			// Verify 200 status code
			expect(response.status).toBe(200);

			// Verify response has the expected structure
			expect(response.data).toBeDefined();
			expect(response.data.AccessToken).toBeDefined();
			expect(response.data.User).toBeDefined();
			expect(response.data.SessionInfo).toBeDefined();
			expect(response.data.ServerId).toBeDefined();

			// Verify user info
			expect(response.data.User.HasPassword).toBe(true);
		});

		test("should return a valid access token", async () => {
			if (!JELLYFIN_URL || !JELLYFIN_LOGIN || !JELLYFIN_PASSWORD) {
				throw new Error(
					"Missing required environment variables: JELLYFIN_URL, JELLYFIN_LOGIN, JELLYFIN_PASSWORD",
				);
			}

			const response = await login({
				url: JELLYFIN_URL,
				login: JELLYFIN_LOGIN,
				pw: JELLYFIN_PASSWORD,
			});

			expect(response.status).toBe(200);
			expect(response.data.AccessToken).toBeTypeOf("string");
			expect(response.data.AccessToken.length).toBeGreaterThan(0);
		});
	});
});
