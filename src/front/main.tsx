import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { JellyfinProvider } from "./context/jellyfin-context.tsx";
import "./index.css";
import Login from "./routes/login.tsx";
import Review from "./routes/review.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<JellyfinProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/review" element={<Review />} />
					</Routes>
				</BrowserRouter>
			</JellyfinProvider>
		</QueryClientProvider>
	</StrictMode>,
);
