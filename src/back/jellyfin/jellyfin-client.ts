import { fetch } from "bun";
import type {
	AuthenticateByNameResponse,
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
	const data: AuthenticateByNameResponse = await res.json();
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
				Authorization: auth,
			},
			body: JSON.stringify({
				CustomQueryString: `SELECT 
    UserId,
    SUM(PlayDuration) as TotalPlayDuration,
    COUNT(*) as TotalPlays,
    ROUND(AVG(PlayDuration), 2) as AvgPlayDuration
FROM PlaybackActivity
GROUP BY UserId
ORDER BY TotalPlayDuration DESC`,
			}),
		},
	)
		.then((res) => res.json())
		.then((res: UsageRankQuery) => {
			const newRes = [];
			for (const result in res.results) {
				newRes.push({
					username: result[0],
					totalDuration: result[1],
					totalPlays: result[2],
					averageDuration: result[3],
				});
			}
			return newRes;
		});
	return res;
};
