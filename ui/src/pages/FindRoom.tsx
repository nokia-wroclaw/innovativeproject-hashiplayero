import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Room from "../components/Room";
import { IRoom } from "../interfaces/IRoom";

import {
  Button,
  InputBase,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Analytics,
  Groups,
  ScreenSearchDesktop,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FindRoom = () => {
  const navigate = useNavigate();
  const { rooms } = useSelector((state: RootState) => state.RoomsList);
  const [searchedName, setSearchedName] = useState("");
  const [searchedDifficulty, setsearchedDifficulty] = useState("");
  const [searchedQuantity, setSearchedQuantity] = useState("");
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const { inWaitingRoom, inSingleGame } = useSelector((state: RootState) => state.StateMachine);

  const [filteredRooms, setFilteredRooms] = useState<IRoom[]>(rooms);

  const handleQuantityInput = (event: SelectChangeEvent) => {
    setSearchedQuantity(event.target.value);
  };

  const handleDifficultyInput = (event: SelectChangeEvent) => {
    setsearchedDifficulty(event.target.value);
  };

  useEffect(() => {
    if (inWaitingRoom && !inSingleGame) {
      navigate(`/waitingroom/${roomAndBoard.name}`);
    }
  }, [inWaitingRoom, navigate, roomAndBoard, inSingleGame]);


  useEffect(() => {
    const inputName = searchedName.toLowerCase();
    const roomsToShow: IRoom[] = rooms.filter((room) => {
      const roomName = room.name.toLowerCase();
      let nameCond = roomName.includes(inputName);      
      
      if (searchedName.replace(/\s/g, '').length === 0) nameCond = true;
      
      const diffCond = room.difficulty.toString() == searchedDifficulty || searchedDifficulty === "";
      const sizeCond = room.boardSize.toString() == searchedQuantity || searchedQuantity === "";
      console.log(room.boardSize, searchedQuantity);
      return nameCond && diffCond && sizeCond;
      
    });
    setFilteredRooms(roomsToShow);
  }, [rooms, searchedQuantity, searchedDifficulty, searchedName]);

  return (
    <>
      <div className="rooms">
        <Grid container className="header filter">
          <Grid item xs={12} sm={6} md={4} className="header-element element">
            <ScreenSearchDesktop />
            <InputBase
              id="room-name"
              placeholder="Room name"
              value={searchedName}
              onChange={(event) => setSearchedName(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} className="header-element element">
            <Groups />
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120, paddingBottom: "16px" }}
              size="small"
            >
              <InputLabel id="room-search-people-number-label">
                Number of people
              </InputLabel>
              <Select
                labelId="room-search-people-number"
                id="room-search-people-number"
                value={searchedQuantity}
                label=""
                onChange={handleQuantityInput}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={7}>Small</MenuItem>
                <MenuItem value={10}>Medium</MenuItem>
                <MenuItem value={15}>Large</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} className="header-element element">
          <Analytics />
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120, paddingBottom: "16px" }}
              size="small"
            >
              <InputLabel id="room-search-board-difficulty-label">
                Board difficulty
              </InputLabel>
              <Select
                labelId="room-search-board-difficulty"
                id="room-search-board-difficulty"
                value={searchedDifficulty}
                label=""
                onChange={handleDifficultyInput}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs className="header-element but">
            <Button color="secondary" endIcon={<Search fontSize="large" />}>
              Search
            </Button>
          </Grid>
        </Grid>

        {filteredRooms != null && filteredRooms.length > 0 ? (
          filteredRooms.map((room: IRoom, index: number) => (
            <Room room={room} key={room.name} />
          ))
        ) : (
          <h1 className="error">
            <span>N</span>
            <span>O</span>
            <span>N</span>
            <span>E</span>
          </h1>
        )}
      </div>
    </>
  );
};

export default FindRoom;
