import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button.tsx";
import Input from "../components/Input.tsx";
import { useJellyfin } from "../context/jellyfin-context.tsx";

export default function Login() {
	const navigate = useNavigate();
	const { login, isLoggingIn, loginError, accessToken } = useJellyfin();
	
	// Redirect if already logged in
	useEffect(() => {
		if (accessToken) {
			console.log("User already logged in, redirecting to /review");
			navigate("/review");
		}
	}, [accessToken, navigate]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [serverUrl, setServerUrl] = useState("");
	const [errors, setErrors] = useState<{
		username?: string;
		password?: string;
		serverUrl?: string;
		general?: string;
	}>({});

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});

		// Basic validation
		const newErrors: typeof errors = {};
		if (!username.trim()) newErrors.username = "Username is required";
		if (!password) newErrors.password = "Password is required";
		if (!serverUrl.trim()) newErrors.serverUrl = "Server URL is required";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			await login({ username, password, serverUrl });
			console.log("Login successful! Redirecting to /review");
			navigate("/review");
		} catch (_error) {
			setErrors({
				general:
					loginError?.message || "Login failed. Please check your credentials.",
			});
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-bg">
			<div className="w-full max-w-md px-6">
				{/* Logo/Title */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-text-primary mb-2">
						Jellyfin year in review
					</h1>
					<p className="text-text-secondary">
						All APIS calls are made in your browser, nothing goes through my
						server.
					</p>
				</div>

				{/* Login Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{errors.general && (
						<div className="p-4 bg-error/10 border border-error rounded-md">
							<p className="text-sm text-error">{errors.general}</p>
						</div>
					)}

					<Input
						id="serverUrl"
						type="url"
						label="Server URL"
						placeholder="https://jellyfin.example.com"
						value={serverUrl}
						onChange={(e) => setServerUrl(e.target.value)}
						error={errors.serverUrl}
						disabled={isLoggingIn}
					/>

					<Input
						id="username"
						type="text"
						label="Username"
						placeholder="Enter your username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						error={errors.username}
						disabled={isLoggingIn}
						autoComplete="username"
					/>

					<Input
						id="password"
						type="password"
						label="Password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						error={errors.password}
						disabled={isLoggingIn}
						autoComplete="current-password"
					/>

					<Button type="submit" fullWidth disabled={isLoggingIn}>
						{isLoggingIn ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</div>
		</div>
	);
}
