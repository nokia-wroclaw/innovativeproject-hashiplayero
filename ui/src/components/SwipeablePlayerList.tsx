import IMember from "../interfaces/IMember";
import { IGameData } from "../interfaces/IRoomAndBoard";
import { PersonRemove } from "@mui/icons-material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Icon } from "@iconify/react";
import playerStatus from "../interfaces/PlayerStatus";

import {
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItem,
  List,
  Button,
  SwipeableDrawer,
  Box,
} from "@mui/material";
import PlayerMobile from "./static-components/PlayerMobile";

type Anchor = "top" | "left" | "bottom" | "right";

const SwipeablePlayerList = ({
  players,
  gameData,
}: {
  players: IMember[];
  gameData: IGameData[];
}) => {
  const [state, setState] = React.useState({
    right: false,
  });

  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { isAdmin } = useSelector((state: RootState) => state.StateMachine);

  function sendCorrectInGameDataUser(userUuid: string): IGameData | undefined {
    return gameData.find((elem: IGameData) => elem.uuid === userUuid);
  }

  const handleKickPlayer = (player: IMember) => {
    if (webSocket !== undefined && isAdmin) {
      webSocket.send(
        JSON.stringify({
          action: "kickUser",
          data: {
            userToKick: player.uuid,
          },
        })
      );
    }
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 350 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {players.map((player, index) => (
          <PlayerMobile
            key={player.uuid}
            player={player}
            userGameData={sendCorrectInGameDataUser(player.uuid)}
            state={playerStatus.none}
          />
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <div>
        <React.Fragment key={"right"}>
          {/* <Button color="secondary" onClick={toggleDrawer('right', true)}>Players</Button> */}
          <SwipeableDrawer
            anchor={"right"}
            open={state["right"]}
            onClose={toggleDrawer("right", false)}
            onOpen={toggleDrawer("right", true)}
          >
            {list("right")}
          </SwipeableDrawer>
        </React.Fragment>
      </div>
    </>
  );
};

export default SwipeablePlayerList;
