import { useEffect, useState } from "react";
import { Bridge } from "../interfaces/IRoomAndBoard";

const ParseBridgesModel = (bridges: Bridge[]) => {
  let parseBridges: number[][] = [];

  bridges.forEach((bridge) => {
    let newBridge: number[] = [bridge.nodeFrom, bridge.nodeTo];
    parseBridges.push(newBridge);
    if (bridge.value === 2) {
      parseBridges.push(newBridge);
    }
  });
  return parseBridges;
};

export default ParseBridgesModel;
