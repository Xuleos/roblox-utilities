# @rbxts/distancepoller

hey hey hey it is much preferred that you use Roblox's new proximity prompt for stuff like this when you can. This method is far far slower and doesn't take things like cameras into account nicely

## Installation
```npm i @rbxts/distancepoller```

## Example Usage
```typescript
import { Workspace } from "@rbxts/services";
import * as DistancePoller from "@rbxts/distancepoller";

const MINIMUM_INTERVAL = 0.1
const MAXIMUM_INTERVAL = 5

const target = Workspace.Part
const radius = 5
const players = [Players.LocalPlayer]

const goal = new DistancePoller.Goal(target, radius, players, (distance) => {
    return math.clamp(distance / 40, MINIMUM_INTERVAL, MAXIMUM_INTERVAL)
});

goal.entered.Connect(() => {
    print("Player entered radius around target")
})

goal.left.Connect(() => {
    print("Player left radius around target")
})
```
