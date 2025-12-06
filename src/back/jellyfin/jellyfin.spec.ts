import { describe, expect, test } from "bun:test";
import {
	getPublicUsers,
	getUserMostViewedShow,
	login,
	userUsageRank,
} from "./jellyfin-client";

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

	describe("login and get user rank", () => {
		test("should login and fetch user usage rank", async () => {
			if (!JELLYFIN_URL || !JELLYFIN_LOGIN || !JELLYFIN_PASSWORD) {
				throw new Error(
					"Missing required environment variables: JELLYFIN_URL, JELLYFIN_LOGIN, JELLYFIN_PASSWORD",
				);
			}

			// Step 1: Login
			const loginResponse = await login({
				url: JELLYFIN_URL,
				login: JELLYFIN_LOGIN,
				pw: JELLYFIN_PASSWORD,
			});

			expect(loginResponse.status).toBe(200);
			expect(loginResponse.data.AccessToken).toBeDefined();

			// Step 2: Get user rank using the access token
			const rankResponse = await userUsageRank({
				url: JELLYFIN_URL,
				auth: loginResponse.data.AccessToken,
			});

			// Verify the response structure
			expect(rankResponse).toBeDefined();
			expect(Array.isArray(rankResponse)).toBe(true);
		});

		test("should login and verify user rank data structure", async () => {
			if (!JELLYFIN_URL || !JELLYFIN_LOGIN || !JELLYFIN_PASSWORD) {
				throw new Error(
					"Missing required environment variables: JELLYFIN_URL, JELLYFIN_LOGIN, JELLYFIN_PASSWORD",
				);
			}

			// Login
			const loginResponse = await login({
				url: JELLYFIN_URL,
				login: JELLYFIN_LOGIN,
				pw: JELLYFIN_PASSWORD,
			});

			expect(loginResponse.status).toBe(200);

			// Get user rank
			const rankResponse = await userUsageRank({
				url: JELLYFIN_URL,
				auth: loginResponse.data.AccessToken,
			});

			// If there are results, verify the structure
			if (rankResponse.length > 0) {
				const firstRank = rankResponse[0];
				expect(firstRank).toBeDefined();
				expect(firstRank).toHaveProperty("userId");
				expect(firstRank).toHaveProperty("totalDuration");
				expect(firstRank).toHaveProperty("totalPlays");
				expect(firstRank).toHaveProperty("averageDuration");
				
				// Log the first rank for visibility
				console.log("First rank:", firstRank);
			}
		});
	});

	describe("getPublicUsers", () => {
		test("should fetch public users", async () => {
			if (!JELLYFIN_URL) {
				throw new Error("Missing required environment variable: JELLYFIN_URL");
			}

			const response = await getPublicUsers({
				url: JELLYFIN_URL,
			});

			// Verify response status
			expect(response.status).toBe(200);
			expect(response.data).toBeDefined();
			expect(Array.isArray(response.data)).toBe(true);
		});

		test("should return valid public user data structure", async () => {
			if (!JELLYFIN_URL) {
				throw new Error("Missing required environment variable: JELLYFIN_URL");
			}

			const response = await getPublicUsers({
				url: JELLYFIN_URL,
			});

			expect(response.status).toBe(200);

			// If there are users, verify the structure
			if (response.data.length > 0) {
				const firstUser = response.data[0];
				expect(firstUser).toBeDefined();
				expect(firstUser).toHaveProperty("Name");
				expect(firstUser).toHaveProperty("ServerId");
				expect(firstUser).toHaveProperty("Id");
				expect(firstUser).toHaveProperty("HasPassword");

				console.log("First public user:", firstUser);
			}
		});
	});

	describe("getUserMostViewedShow", () => {
		test("should login and fetch user's most viewed show", async () => {
			if (!JELLYFIN_URL || !JELLYFIN_LOGIN || !JELLYFIN_PASSWORD) {
				throw new Error(
					"Missing required environment variables: JELLYFIN_URL, JELLYFIN_LOGIN, JELLYFIN_PASSWORD",
				);
			}

			// Step 1: Login
			const loginResponse = await login({
				url: JELLYFIN_URL,
				login: JELLYFIN_LOGIN,
				pw: JELLYFIN_PASSWORD,
			});

			expect(loginResponse.status).toBe(200);
			expect(loginResponse.data.AccessToken).toBeDefined();
			expect(loginResponse.data.User.Id).toBeDefined();

			// Step 2: Get user's most viewed show
			const mostViewedShow = await getUserMostViewedShow({
				url: JELLYFIN_URL,
				auth: loginResponse.data.AccessToken,
				userId: loginResponse.data.User.Id,
			});

			// Verify the response
			if (mostViewedShow) {
				expect(mostViewedShow.showName).toBeDefined();
				expect(mostViewedShow.playCount).toBeDefined();
				expect(mostViewedShow.totalDuration).toBeDefined();

				console.log("Most viewed show:", mostViewedShow);
			} else {
				console.log("User has no viewing history");
			}
		});
	});
});
