import IMember from "../interfaces/IMember";
import { IconButton } from "@mui/material";
import {PersonRemove} from '@mui/icons-material';
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const Player = ({ player }: { player: IMember }) => {
    const { user } = useSelector((state: RootState) => state.defaultUser);

    return (
        <div className="header-element element">
            {
                player.uuid === user.uuid ?
                <div style={{margin:"0px 8px"}}>
                    {player.name} (You)
                </div> : <div style={{margin:"0px 8px"}}>
                    {player.name}
                </div>
            }

            <div>
            <IconButton color="secondary" aria-label="upload picture" component="span" size="small">
                <PersonRemove />
            </IconButton>
            </div>
        </div>
    );
}

export default Player;