import React, { useState } from "react";
import ky from 'ky'
import {
    Slider,
    MenuItem,
    FormControl,
    Grid,
    Input,
    InputLabel,
    Select,
    Button,
    TextField,
    Checkbox
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";

interface State {
    amountOfPlayersInput: number;
    roomNameInput: string;
    passwordInput: string;
    seedInput: string;
    difficultyInput: number;
    boardSizeInput: number;
    timeLimitInput: Date;
    enableTimeLimitInput: boolean;
    isDisabled: boolean;
}

interface IMark{
    value: number;
    label: string;
}

function createMarks() {
    const marks: IMark[] = [];
    for (let i = 1; i <= 10; i++) {
        marks.push({
            value: i,
            label: i.toString(),
        });
    }
    return marks;
}


function valueLabelFormat(value: number) {
    const marks = createMarks();
    return marks.findIndex((mark) => mark.value === value) + 1;
}
  

const CreateRoom = () => {
    const marks = createMarks();
    const [values, setValues] = useState<State>({
        amountOfPlayersInput: 2,
        roomNameInput: "",
        passwordInput: "",
        seedInput: "",
        difficultyInput: 2,
        boardSizeInput: 10,
        timeLimitInput: new Date(0),
        enableTimeLimitInput: false,
        isDisabled: true,
      });

    const [value, setValue] = React.useState<number | string | Array<number | string>>(2);

    const handleChange = (prop: keyof State) => (event: any) => {
        if (prop === "enableTimeLimitInput"){
            setValues({ ...values, [prop]: event.target.checked });
        } else {
            setValues({ ...values, [prop]: event.target.value });   
        }
        
      };

    const { user } = useSelector((state: RootState) => state.defaultUser);
    const { webSocket } = useSelector((state: RootState) => state.webSocket);
    const dispatch = useAppDispatch();

    const handleCreateRoom = () => {
        let nameOfRoom = "Pokoj-" + user.uuid;
        if (webSocket !== undefined) {
          webSocket.send(
            JSON.stringify({
              action: "createRoom",
              userUuid: user.uuid,
              data: {
                name: values.roomNameInput,
                password: values.passwordInput,
                maxPlayers: values.amountOfPlayersInput,
                isPrivate: values.isDisabled,
                timeLimit: values.timeLimitInput.getMinutes(),
                difficulty: values.difficultyInput,
                boardSize: values.boardSizeInput,
              },
            })
          );
        }
        console.log("WebSocket-> Create Room");
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue);
        setValues({ ...values, "amountOfPlayersInput": Number(newValue)});
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        setValues({ ...values, "amountOfPlayersInput": event.target.value === '' ? 0 : Number(event.target.value)});

    };

    const handleBlur = () => {
        if (value < 0) {
          setValue(0);
        } else if (value > 10) {
          setValue(10);
        }
    };

    return (
        <>
            <div className="form-container paper">
                <div className="general-info">

                    <div className="form-element">
                        {/* <FormControl fullWidth>
                            <InputLabel id="roomNameLabel">Room name</InputLabel> */}
                            <TextField
                                id="roomNameInput"
                                type="text"
                                value={values.roomNameInput}
                                variant="outlined"
                                label="Room name"
                                onChange={handleChange("roomNameInput")}
                            />
                        {/* </FormControl> */}
                    </div>

                    <div className="form-element">
                        {/* <FormControl fullWidth>
                            <InputLabel id="passwordLabel">Password</InputLabel> */}
                            <TextField
                                id="passwordInput"
                                type="Password"
                                variant="outlined"
                                label="Password"
                                value={values.passwordInput}
                                onChange={handleChange("passwordInput")}
                            />
                        {/* </FormControl> */}
                    </div>

                    <div className="form-element">
                        {/* <FormControl fullWidth>
                        <InputLabel id="timeLimitLabel">Seed</InputLabel> */}
                        <TextField
                            id="seedInput"
                            type="text"
                            variant="outlined"
                            label="Seed"
                            value={values.seedInput}
                            onChange={handleChange("seedInput")}
                        />
                        {/* </FormControl> */}
                    </div>

                    <Grid item minWidth={400}>
                        <FormControl fullWidth>
                            <InputLabel id="playersLabel">Number Of Players</InputLabel>
                            <Input
                                value={value}
                                size="small"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 10,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </FormControl>
                    </Grid>

                    <Slider
                        aria-label="Custom marks"
                        marks={marks}
                        valueLabelDisplay="auto"
                        valueLabelFormat={valueLabelFormat}
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        min={1}
                        step={1}
                        max={10} 
                    />

                    <div className="form-element">
                        <FormControl fullWidth>
                            <InputLabel id="difficultyLabel">Board size</InputLabel>
                            <Select
                                labelId="difficultyLabelId"
                                id="difficultyInput"
                                value={values.difficultyInput}
                                label="Difficulty"
                                onChange={handleChange("difficultyInput")}
                            >
                                <MenuItem value={1}>Easy</MenuItem>
                                <MenuItem value={2}>Medium</MenuItem>
                                <MenuItem value={3}>Hard</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    
                    <div className="form-element">
                        <FormControl fullWidth>
                            <InputLabel id="boardSizeLabel">Board size</InputLabel>
                            <Select
                                labelId="boardSizeLabelId"
                                id="boardSizeInput"
                                value={values.boardSizeInput}
                                label="Boardsize"
                                onChange={handleChange("boardSizeInput")}
                            >
                                <MenuItem value={7}>Seven</MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={15}>Fifteen</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <h5>Enable Time Limit</h5>
                        <Checkbox
                            checked={values.enableTimeLimitInput}
                            onChange={handleChange("enableTimeLimitInput")}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>

                    <div className="form-element">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileTimePicker
                            views={["minutes", "seconds"]}
                            ampm={false}
                            inputFormat="mm:ss"
                            mask="__:__"
                            label="Minutes and seconds"
                            value={values.timeLimitInput}
                            disabled={values.enableTimeLimitInput}
                            onChange={(newValue) => {
                            if (newValue !== null) {
                                setValues({ ...values, timeLimitInput: newValue });
                            }
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        </LocalizationProvider>
                    </div>
                </div>

                <Button onClick={() => {
                        handleCreateRoom();
                    }}
                    color="secondary">
                    Create!
                </Button>
            </div>
        </>
    );
}

export default CreateRoom;
