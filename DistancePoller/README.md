# @rbxts/distancepoller
A small utility for priority distance polling. This means that it polls an object's distance quicker/slower depending on how far away it was last time it checked

## Installation
```npm i @rbxts/distancepoller```

## Example Usage
```typescript
import * as DistancePoller from "@rbxts/distancepoller";

const MINIMUM_INTERVAL = 0.1
const MAXIMUM_INTERVAL = 5

const radius = 5
const players = [Players.LocalPlayer]

const goal = new Goal(target, radius, players, (distance) => {
    return math.min(math.max(distance / 40, MINIMUM_INTERVAL), MAXIMUM_INTERVAL);
});

goal.entered.Connect(() => {
    print("Player entered radius around target")
})

goal.left.Connect(() => {
    print("Player left radius around target")
})
```
