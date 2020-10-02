import { RunService, HttpService } from "@rbxts/services";

type ConnectionCallback = (step: number) => void;

interface EventConfig {
	priority: number;
	func: ConnectionCallback;
	key: string;
}

const listeners: Array<EventConfig> = [];

export function Connect(priority: number, func: ConnectionCallback) {
	const key = HttpService.GenerateGUID();

	listeners.push({
		priority: priority,
		func: func,
		key: key,
	});

	listeners.sort((a, b) => {
		return a.priority < b.priority;
	});

	return {
		Disconnect: () => {
			const connectionIndex = listeners.findIndex((value) => {
				if (value.key === key) {
					return true;
				}
			});

			listeners.remove(connectionIndex);
		},
	};
}

RunService.Heartbeat.Connect((step) => {
	for (let i = 0; i < listeners.size(); i++) {
		const element = listeners[i];

		element.func(step);
	}
});
