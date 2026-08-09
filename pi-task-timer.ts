import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	let startedAt: number | undefined;
	let timer: ReturnType<typeof setInterval> | undefined;

	const formatDuration = (milliseconds: number): string => {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
		if (minutes > 0) return `${minutes}m ${seconds}s`;
		return `${seconds}s`;
	};

	const stopTimer = (): void => {
		if (timer !== undefined) clearInterval(timer);
		timer = undefined;
	};

	pi.on("before_agent_start", (_event, ctx) => {
		if (ctx.mode !== "tui" || startedAt !== undefined) return;

		startedAt = Date.now();

		const updateStatus = (): void => {
			if (startedAt === undefined) return;
			const elapsed = formatDuration(Date.now() - startedAt);
			ctx.ui.setStatus(
				"task-timer",
				ctx.ui.theme.fg("accent", `⏱ ${elapsed}`),
			);
		};

		updateStatus();
		timer = setInterval(updateStatus, 1000);
	});

	pi.on("agent_settled", (_event, ctx) => {
		if (startedAt === undefined) return;

		stopTimer();
		const elapsed = formatDuration(Date.now() - startedAt);
		startedAt = undefined;

		ctx.ui.setStatus(
			"task-timer",
			ctx.ui.theme.fg("success", `✓ ${elapsed}`),
		);
	});

	pi.on("session_shutdown", () => {
		stopTimer();
		startedAt = undefined;
	});
}
