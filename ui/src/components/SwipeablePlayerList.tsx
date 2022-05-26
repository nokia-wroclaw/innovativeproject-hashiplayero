import IMember from "../interfaces/IMember";
import { IGameData } from "../interfaces/IRoomAndBoard";
import Player from "./Player";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

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


    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };


    function sendCorrectInGameDataUser(userUuid: string): IGameData | undefined {
        return gameData.find((elem: IGameData) => elem.uuid === userUuid);
    };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <div>
                <React.Fragment key={'right'}>
                    <Button onClick={toggleDrawer('right', true)}>Player</Button>
                    <SwipeableDrawer
                        anchor={'right'}
                        open={state['right']}
                        onClose={toggleDrawer('right', false)}
                        onOpen={toggleDrawer('right', true)}
                    >
                        {list('right')}
                    </SwipeableDrawer>
                </React.Fragment>
            </div>
        </>
    );
};

export default SwipeablePlayerList;