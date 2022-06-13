import { PersonRemove } from "@mui/icons-material";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { RootState } from "../../store/store";
import { IGameData } from "../../interfaces/IRoomAndBoard";
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
import IMember from "../../interfaces/IMember";
import playerStatus from "../../interfaces/PlayerStatus";
import { Icon } from "@iconify/react";

type Anchor = "top" | "left" | "bottom" | "right";

const PlayerMobile = ({
  player,
  userGameData,
  state,
}: {
  player: IMember;
  userGameData: IGameData | undefined;
  state: playerStatus;
}) => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { isAdmin } = useSelector((state: RootState) => state.StateMachine);

  const [frowWhere, setFrowWhere] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

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

      setFrowWhere({ ...frowWhere, [anchor]: open });
    };

  const handleKickPlayer = () => {
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

  return (
    <>
      <ListItem key={player.uuid} disablePadding>
        <ListItemButton>
          <ListItemText
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ maxWidth: "90%", display: "block" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                  noWrap
                >
                  {player.uuid === user.uuid
                    ? `${player.name} (You)`
                    : player.name}
                </Typography>
              </React.Fragment>
            }
          />
          {isAdmin && (
            <ListItemIcon
              onClick={() => {
                handleKickPlayer();
              }}
            >
              <PersonRemove />
            </ListItemIcon>
          )}
          {
            // tutaj porównać z uuid admina
            isAdmin && <Icon icon="emojione:crown" width="32" height="32" />
          }
          {state === playerStatus.firstPlace && (
            <Icon icon="noto:1st-place-medal" width="32" height="32" />
          )}
          {state === playerStatus.secondPlace && (
            <Icon icon="noto:2nd-place-medal" width="32" height="32" />
          )}
          {state === playerStatus.thirdPlace && (
            <Icon icon="noto:3rd-place-medal" width="32" height="32" />
          )}
        </ListItemButton>
      </ListItem>
    </>
  );
};

export default PlayerMobile;
