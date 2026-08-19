import assert from "node:assert/strict";
import test from "node:test";

import taskTimer, { formatDuration } from "../src/index.ts";

function createHarness(mode = "tui") {
	const handlers = new Map();
	const statuses = [];
	const pi = {
		on(event, handler) {
			handlers.set(event, handler);
		},
	};
	const ctx = {
		mode,
		ui: {
			theme: {
				fg(color, text) {
					return `${color}:${text}`;
				},
			},
			setStatus(key, value) {
				statuses.push([key, value]);
			},
		},
	};

	taskTimer(pi);
	return { ctx, handlers, statuses };
}

test("formatDuration formats second, minute, and hour boundaries", () => {
	assert.equal(formatDuration(0), "0s");
	assert.equal(formatDuration(59_999), "59s");
	assert.equal(formatDuration(60_000), "1m 0s");
	assert.equal(formatDuration(3_599_999), "59m 59s");
	assert.equal(formatDuration(3_600_000), "1h 0m 0s");
	assert.equal(formatDuration(3_661_000), "1h 1m 1s");
});

test("non-TUI mode does not start a timer", () => {
	const originalSetInterval = globalThis.setInterval;
	let intervalCalls = 0;
	globalThis.setInterval = () => {
		intervalCalls += 1;
		return 1;
	};

	try {
		const { ctx, handlers, statuses } = createHarness("print");
		handlers.get("before_agent_start")({}, ctx);

		assert.equal(intervalCalls, 0);
		assert.deepEqual(statuses, []);
	} finally {
		globalThis.setInterval = originalSetInterval;
	}
});

test("timer starts once, updates, settles, and can restart", () => {
	const originalNow = Date.now;
	const originalSetInterval = globalThis.setInterval;
	const originalClearInterval = globalThis.clearInterval;
	let now = 1_000;
	const intervalCallbacks = [];
	const clearedTimers = [];

	Date.now = () => now;
	globalThis.setInterval = (callback) => {
		const timer = { id: intervalCallbacks.length + 1 };
		intervalCallbacks.push({ callback, timer });
		return timer;
	};
	globalThis.clearInterval = (timer) => {
		clearedTimers.push(timer);
	};

	try {
		const { ctx, handlers, statuses } = createHarness();
		const beforeAgentStart = handlers.get("before_agent_start");
		const agentSettled = handlers.get("agent_settled");

		beforeAgentStart({}, ctx);
		beforeAgentStart({}, ctx);
		assert.equal(intervalCallbacks.length, 1);
		assert.deepEqual(statuses.at(-1), ["task-timer", "accent:⏱ 0s"]);

		now = 62_000;
		intervalCallbacks[0].callback();
		assert.deepEqual(statuses.at(-1), ["task-timer", "accent:⏱ 1m 1s"]);

		agentSettled({}, ctx);
		assert.deepEqual(clearedTimers, [intervalCallbacks[0].timer]);
		assert.deepEqual(statuses.at(-1), ["task-timer", "success:✓ 1m 1s"]);

		now = 70_000;
		beforeAgentStart({}, ctx);
		assert.equal(intervalCallbacks.length, 2);
	} finally {
		Date.now = originalNow;
		globalThis.setInterval = originalSetInterval;
		globalThis.clearInterval = originalClearInterval;
	}
});

test("session shutdown clears an active timer", () => {
	const originalSetInterval = globalThis.setInterval;
	const originalClearInterval = globalThis.clearInterval;
	const timer = { id: 1 };
	const clearedTimers = [];

	globalThis.setInterval = () => timer;
	globalThis.clearInterval = (value) => {
		clearedTimers.push(value);
	};

	try {
		const { ctx, handlers } = createHarness();
		handlers.get("before_agent_start")({}, ctx);
		handlers.get("session_shutdown")();

		assert.deepEqual(clearedTimers, [timer]);
	} finally {
		globalThis.setInterval = originalSetInterval;
		globalThis.clearInterval = originalClearInterval;
	}
});
