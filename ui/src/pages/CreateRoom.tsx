import React, { useState } from "react";
import ky from 'ky'
import {
    Box,
    FormGroup,
    FormControlLabel,
    FormControl,
    Grid,
    Input,
    InputLabel,
    Switch,
    Button
} from "@mui/material";

const CreateRoom = () => {
    const [amountOfPlayersInput, setAmountOfPlayersInput] = useState<number>(2);
    const [roomNameInput, setRoomNameInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [seedInput, setSeedInput] = useState<string>("");
    const [difficultyInput, setDifficultyInput] = useState<number>(2);
    const [boardSizeInput, setBoardSizeInput] = useState<number>(10);
    const [timeLimitInput, setTimeLimitInput] = useState<number>(10);
    const [enableTimeLimitInput, setEnableTimeLimitInput] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const handleSetAmountOfPlayersInput = (event: any) => {
        setAmountOfPlayersInput(event.target.value);
    };
    const handleSetRoomNameInput = (event: any) => {
        setRoomNameInput(event.target.value);
    };
    const handleSetPasswordInput = (event: any) => {
        setPasswordInput(event.target.value);
    };
    const handleSetSeedInput = (event: any) => {
        setSeedInput(event.target.value);
    };
    const handleSetDifficultyInput = (event: any) => {
        setDifficultyInput(event.target.value);
    };
    const handleSetBoardSizeInput = (event: any) => {
        setBoardSizeInput(event.target.value);
    };
    const handleSetTimeLimitInput = (event: any) => {
        setTimeLimitInput(event.target.value);
    };
    const handleSetEnableTimeLimitInput = (event: any) => {
        setEnableTimeLimitInput(event.target.checked);
        if (!event.target.checked) {
            setIsDisabled(true);
        }
        else {
            setIsDisabled(false);
        }
    };

    const handleCreateRoom = () => {

        const formData = new FormData();
        formData.append('name', roomNameInput);
        formData.append('password', passwordInput);
        formData.append('seed', seedInput);
        formData.append('players', amountOfPlayersInput.toString());
        formData.append('difficulty', difficultyInput.toString());
        formData.append('boardSize', boardSizeInput.toString());

        if (!enableTimeLimitInput) {
            formData.append('timeLimit', "null");
        }
        else {
            formData.append('timeLimit', timeLimitInput.toString());
        }

        const response = ky.put("http://localhost:3001/api/createroom", {
            body: formData
        })
    }

    return (
        <>
            <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={4}
            >
                <Grid item minWidth={400}>
                    <FormControl fullWidth>
                        <InputLabel id="roomNameLabel">Room name</InputLabel>
                        <Input
                            id="roomNameInput"
                            type="text"
                            value={roomNameInput}
                            onChange={handleSetRoomNameInput}
                        />
                    </FormControl>
                </Grid>
                <Grid item minWidth={400}>
                    <FormControl fullWidth>
                        <InputLabel id="passwordLabel">Password</InputLabel>
                        <Input
                            id="passwordInput"
                            type="Password"
                            value={passwordInput}
                            onChange={handleSetPasswordInput}
                        />
                    </FormControl>
                </Grid>
                <Grid item minWidth={400}>
                    <FormControl fullWidth>
                        <InputLabel id="seedLabel">Seed</InputLabel>
                        <Input
                            id="seedInput"
                            type="text"
                            value={seedInput}
                            onChange={handleSetSeedInput}
                        />
                    </FormControl>
                </Grid>
                <Grid item minWidth={400}>
                    <FormControl fullWidth>
                        <InputLabel id="playersLabel">Amount Of Players</InputLabel>
                        <Input
                            id="playersInput"
                            type="number"
                            value={amountOfPlayersInput}
                            onChange={handleSetAmountOfPlayersInput}
                        />
                    </FormControl>
                </Grid>
                <Grid item minWidth={400}>
                    <FormControl fullWidth>
                        <InputLabel id="difficultyLabel">Difficulty</InputLabel>
                        <Input
                            id="diffucltyInput"
                            type="number"
                            value={difficultyInput}
                            onChange={handleSetDifficultyInput}
                        />
                    </FormControl>
                </Grid>
                <Grid item minWidth={400}>
                    <FormControl fullWidth>
                        <InputLabel id="boardSizeLabel">Board size</InputLabel>
                        <Input
                            id="boardSizeInput"
                            type="number"
                            value={boardSizeInput}
                            onChange={handleSetBoardSizeInput}
                        />
                    </FormControl>
                </Grid>
                <FormGroup>
                    <Box
                        sx={{
                            mt: 3
                        }}>
                        <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="Enable Time Limit"
                            checked={enableTimeLimitInput}
                            onChange={handleSetEnableTimeLimitInput}
                        />
                    </Box>
                </FormGroup>
                <Grid item minWidth={400}>
                    <FormControl fullWidth>
                        <InputLabel id="boardSizeLabel">Time limit</InputLabel>
                        <Input
                            disabled={isDisabled}
                            id="timeLimitInput"
                            type="number"
                            value={timeLimitInput}
                            onChange={handleSetTimeLimitInput}
                        />
                    </FormControl>
                </Grid>
                <Grid item minWidth={400}>
                    <div className="content-buttons">
                        {/* <button
                            className="button-primary-centered"
                            type="button"
                            onClick={() => {
                                handleCreateRoom();
                            }}
                        >
                            <div className="text-start-game text-center">Create room!</div>
                        </button> */}
                        <Button onClick={() => {
                                handleCreateRoom();
                            }}
                            color="secondary">
                            Create a room!
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}

export default CreateRoom;
