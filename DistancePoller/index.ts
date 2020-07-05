import Signal from "@rbxts/signal";
import { RunService } from "@rbxts/services";

const LOWER_INTERVAL = 0.1;
const UPPER_INTERVAL = 5;

export class Goal {
	public static goals: Array<Goal> = [];

	public entered = new Signal<(player: Player) => void>();
	public left = new Signal<(player: Player) => void>();

	public part: BasePart;
	public radius: number;

	//Am I using the word "agent" correctly here?
	public agents: Map<
		Player,
		{
			interval: number;
			step: number;
			inside: boolean;
		}
	>;

	public updateInterval: (distance: number) => number;

	//TODO: Add way to create a goal without needing a part
	//TODO: Add a way to use this for non-players
	public constructor(
		part: BasePart,
		radius: number,
		players: Array<Player>,
		updateInterval?: (distance: number) => number,
	) {
		this.part = part;
		this.radius = radius;

		this.agents = new Map();

		for (const player of players) {
			this.agents.set(player, {
				interval: 1,
				step: 0,
				inside: false,
			});
		}

		if (updateInterval !== undefined) {
			this.updateInterval = updateInterval;
		} else {
			this.updateInterval = Goal.defaultUpdateInterval;
		}

		Goal.goals.push(this);
	}

	public addPlayer(player: Player) {
		this.agents.set(player, {
			interval: 1,
			step: 0,
			inside: false,
		});
	}

	public removePlayer(player: Player) {
		return this.agents.delete(player);
	}

	public destroy() {
		this.entered.Destroy();
		this.left.Destroy();

		const thisIndex = Goal.goals.findIndex((value) => {
			return value === this;
		});

		Goal.goals.unorderedRemove(thisIndex);
	}

	public static defaultUpdateInterval(this: void, distance: number) {
		/**
		 * Will be 0.1 at 0 distance and 5 at 200
		 */
		return math.min(math.max(distance / 40, LOWER_INTERVAL), UPPER_INTERVAL);
	}
}

//TODO: Use task splitter so we don't have to be doing all of this on a single heartbeat
RunService.Heartbeat.Connect((step) => {
	for (const goal of Goal.goals) {
		for (const [player, agent] of goal.agents) {
			agent.step += step;

			const character = player.Character;
			if (character && character.PrimaryPart) {
				if (agent.step >= agent.interval) {
					agent.step = 0;

					const distance = goal.part.Position.sub(character.PrimaryPart.Position).Magnitude;

					agent.interval = goal.updateInterval(distance);

					if (distance <= goal.radius) {
						if (agent.inside === false) {
							agent.inside = true;
							goal.entered.Fire(player);
						}
					} else {
						if (agent.inside === true) {
							agent.inside = false;
							goal.left.Fire(player);
						}
					}
				}
			}
		}
	}
});
