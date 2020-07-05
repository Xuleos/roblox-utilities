import { RunService, HttpService } from "@rbxts/services";

type ConnectionCallback = (step: number) => void;

interface EventConfig {
	Priority: number;
	Func: ConnectionCallback;
	Key: string;
}

const Listeners: Array<EventConfig> = [];

export function Connect(Priority: number, Func: ConnectionCallback) {
	const Key = HttpService.GenerateGUID();

	Listeners.push({
		Priority: Priority,
		Func: Func,
		Key: Key,
	});

	Listeners.sort((a, b) => {
		return a.Priority < b.Priority;
	});

	return {
		Disconnect: () => {
			const ConnectionIndex = Listeners.findIndex((value) => {
				if (value.Key === Key) {
					return true;
				}
			});

			Listeners.remove(ConnectionIndex);
		},
	};
}

RunService.Heartbeat.Connect((step) => {
	for (let i = 0; i < Listeners.size(); i++) {
		const element = Listeners[i];

		element.Func(step);
	}
});
