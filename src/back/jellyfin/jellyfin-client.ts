import type {
	AuthenticateByNameResponse,
	MostViewedShowQuery,
	PublicUserResponse,
	UsageRankQuery,
} from "./jellyfin-model";
import { createAuthString, getDefaultUserAgent } from "./jellyfin-utils";

export const login = async ({
	pw,
	login,
	url,
}: {
	pw: string;
	login: string;
	url: string;
}) => {
	// path: Users/authenticatebyname
	const res = await fetch(`${url}/Users/authenticatebyname`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `MediaBrowser Client="Jellyfin Web", Device="Chrome", DeviceId="${createAuthString(getDefaultUserAgent(), new Date().getMilliseconds())}", Version="10.10.7"`,
		},
		body: JSON.stringify({
			Pw: pw,
			Username: login,
		}),
	});
	const data = (await res.json()) as AuthenticateByNameResponse;
	if (res.status !== 200) console.log(data);
	return { status: res.status, data };
};

export const userUsageRank = async ({
	auth,
	url,
}: {
	auth: string;
	url: string;
}) => {
	// user_usage_stats/submit_custom_query?stamp=17649742021
	const res = await fetch(
		`${url}/user_usage_stats/submit_custom_query?stamp=${new Date().getMilliseconds()}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"X-MediaBrowser-Token": auth,
			},
			body: JSON.stringify({
				CustomQueryString: `SELECT 
    UserId,
    SUM(PlayDuration) as TotalPlayDuration,
    COUNT(*) as TotalPlays,
    ROUND(AVG(PlayDuration), 2) as AvgPlayDuration
FROM PlaybackActivity
WHERE DateCreated >= '2025-01-01'
GROUP BY UserId
ORDER BY TotalPlayDuration DESC`,
			}),
		},
	)
		.then((res) => {
			return res.json() as Promise<UsageRankQuery>;
		})
		.then((res) => {
			if (!res || !res.results) {
				console.log("No results found in response, returning empty array");
				return [];
			}
			const newRes = [];

			for (const result of res.results) {
				newRes.push({
					userId: result[0]!,
					totalDuration: Number(result[1]) / 60, // Convert seconds to minutes
					totalPlays: Number(result[2]),
					averageDuration: Number(result[3]) / 60, // Convert seconds to minutes
				});
			}
			return newRes;
		});
	return res;
};

export const getPublicUsers = async ({ url }: { url: string }) => {
	const res = await fetch(`${url}/users/public`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
	});

	const data = (await res.json()) as PublicUserResponse[];

	if (res.status !== 200) {
		console.log("Failed to fetch public users:", data);
	}

	return { status: res.status, data };
};

export const getUserMostViewedShow = async ({
	auth,
	url,
	userId,
}: {
	auth: string;
	url: string;
	userId: string;
}) => {
	const res = await fetch(
		`${url}/user_usage_stats/submit_custom_query?stamp=${new Date().getMilliseconds()}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"X-MediaBrowser-Token": auth,
			},
			body: JSON.stringify({
				CustomQueryString: `SELECT
					substr(ItemName, 0, instr(ItemName, ' - ')) AS name,
					COUNT(1) AS play_count,
					SUM(PlayDuration) AS total_duration,
					MAX(ItemId) AS item_id
				FROM PlaybackActivity
				WHERE ItemType = 'Episode' AND UserId = '${userId}' AND DateCreated >= '2025-01-01'
				GROUP BY substr(ItemName, 0, instr(ItemName, ' - '))
				ORDER BY total_duration DESC
				LIMIT 5`,
			}),
		},
	)
		.then((res) => {
			console.log("Most viewed show response status:", res.status);
			return res.json() as Promise<MostViewedShowQuery>;
		})
		.then(async (res) => {
			console.log("Most viewed shows response:", JSON.stringify(res, null, 2));

			if (!res || !res.results || res.results.length === 0) {
				console.log("No most viewed shows found");
				return [];
			}

			// Fetch series IDs for each show
			const showsWithImages = await Promise.all(
				res.results.map(async (result) => {
					const [showName, playCount, totalDuration, episodeItemId] = result;

					// Fetch episode details to get SeriesId
					try {
						const itemRes = await fetch(`${url}/Users/${userId}/Items/${episodeItemId}`, {
							headers: {
								"X-MediaBrowser-Token": auth,
							},
						});

						const itemData = await itemRes.json() as { SeriesId?: string };
						const seriesId = itemData.SeriesId || episodeItemId!;

						return {
							showName: showName!,
							playCount: Number(playCount),
							totalDuration: Number(totalDuration) / 60, // Convert seconds to minutes
							seriesId: seriesId,
							imageUrl: `${url}/Items/${seriesId}/Images/Primary?maxHeight=400&quality=90`,
						};
					} catch (error) {
						console.error(`Failed to fetch series ID for ${showName}:`, error);
						// Fallback to episode ID if series fetch fails
						return {
							showName: showName!,
							playCount: Number(playCount),
							totalDuration: Number(totalDuration) / 60, // Convert seconds to minutes
							seriesId: episodeItemId!,
							imageUrl: `${url}/Items/${episodeItemId}/Images/Primary?maxHeight=400&quality=90`,
						};
					}
				})
			);

			return showsWithImages;
		});

	return res;
};
