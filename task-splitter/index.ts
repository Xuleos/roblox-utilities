import * as HeartbeatPriority from "./HeartbeatPriority";

const DEFAULT_UPDATE_INTERVAL = 0.25;

export default class TaskSplitter<T> {
	stepConnection: {
		Disconnect: () => void;
	};
	fetchFunc: () => Array<T>;
	executeFunc: (item: T) => void;

	currentIndex: number;

	updatesPerSecond = 0;
	updatesPerFrame = 0;
	updateAccumlator = 0;

	updateInterval: number;

	constructor(
		priority: number,
		fetchFunc: () => Array<T>,
		executeFunc: (item: T) => void,
		updateInterval = DEFAULT_UPDATE_INTERVAL,
	) {
		this.fetchFunc = fetchFunc;
		this.executeFunc = executeFunc;

		this.updateInterval = updateInterval;

		this.currentIndex = 0;

		this.stepConnection = HeartbeatPriority.Connect(priority, (dt) => {
			if (dt === 0) {
				return;
			}

			const items = fetchFunc();

			this.updatesPerSecond = items.size() / this.updateInterval;
			this.updatesPerFrame = this.updatesPerSecond * dt;

			this.updateAccumlator += this.updatesPerFrame;

			const updateCount = math.min(math.floor(this.updateAccumlator), items.size());
			this.updateAccumlator -= updateCount;

			for (let i = 0; i < updateCount; i++) {
				this.currentIndex += 1;

				if (this.currentIndex >= items.size()) {
					this.currentIndex = 0;
				}

				this.executeFunc(items[this.currentIndex]);
			}
		});
	}
}
