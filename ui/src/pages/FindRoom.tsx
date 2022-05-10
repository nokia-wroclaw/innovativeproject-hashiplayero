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
  GridOn,
  Groups,
  ScreenSearchDesktop,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FindRoom = () => {
  const navigate = useNavigate();
  const { rooms } = useSelector((state: RootState) => state.RoomsList);
  const [searchedName, setSearchedName] = useState("");
  const [searchedSize, setSearchedSize] = useState("");
  const [searchedQuantity, setSearchedQuantity] = useState("");
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);

  // const [filteredRooms, setFilteredRooms] = useState<IRoom[]>([]);

  let filteredRooms = rooms;

  const handleQuantityInput = (event: SelectChangeEvent) => {
    setSearchedQuantity(event.target.value);
  };

  const handleSizeInput = (event: SelectChangeEvent) => {
    setSearchedSize(event.target.value);
  };

  useEffect(() => {
    if (roomAndBoard.name !== "name" && roomAndBoard.name.length > 0) {
      navigate(`/waitingroom/${roomAndBoard.name}`);
    }
  }, [roomAndBoard, navigate]);

  // useEffect(() => {
  //     filteredRooms = rooms.filter((room) => {
  //       if (searchedName !== "" && searchedSize !== "" && searchedQuantity !== "") return true;
  //       const studentName = room.name.toLowerCase().split(" ");
  //       debugger;
  //       const names = searchedName.split(" ");
  //       let inputName = searchedName.toLowerCase().split(" ");
  //       // if (names === undefined) {
  //       //   inputName = "";
  //       // }
  //       if (
  //         inputName === null
  //             ? true
  //             : inputName.every((item) =>
  //                 studentName.some((name) =>
  //                   name.includes(item.toLowerCase())
  //                 )
  //               )
  //         ) {
  //           debugger;
  //           return room;
  //         }
  //     });
  // }, [searchedQuantity, searchedSize, searchedName]);

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
            <GridOn />
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
                value={searchedSize}
                label=""
                onChange={handleSizeInput}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Normal</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
              </Select>
            </FormControl>
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
