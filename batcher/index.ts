
/** Puts an array of items in batches for you to update over time instead of all at once */
export default class Batcher<T> {
	private currentIndex = 0;

	private updatesPerSecond = 0;
	private updatesPerFrame = 0;
	private updateAccumlator = 0;

	private items: Array<T>

	/**
	 * @param getItems - you should return the items you want batched in this
	 * @param updateInterval - interval at which items should be updated
	 */
	constructor(private updateInterval: number, private getItems: () => Array<T>) {
		this.items = getItems()
	}

	/**
	 * @param deltaTime - time between last batch.step(deltaTime) call and now
	 * @returns an array of items to update
	 */
	public step(deltaTime: number) {
		if (deltaTime === 0) {
			return [];
		}


		this.updatesPerSecond = this.items.size() / this.updateInterval;
		this.updatesPerFrame = this.updatesPerSecond * deltaTime;
		this.updateAccumlator += this.updatesPerFrame;

		const updateCount = math.min(math.floor(this.updateAccumlator), this.items.size());
		this.updateAccumlator -= updateCount;

		const batch: Array<T> = new Array(updateCount);

		for (let i = 0; i < updateCount; i++) {
			this.currentIndex += 1;

			if (this.currentIndex >= this.items.size()) {
				this.items = this.getItems()
				this.currentIndex = 0;
			}

			batch.push(this.items[this.currentIndex]);
		}

		return batch;
	}
}
