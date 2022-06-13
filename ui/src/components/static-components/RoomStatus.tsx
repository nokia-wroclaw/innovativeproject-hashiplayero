import { LockOpen, Lock } from "@mui/icons-material";

const RoomStatusDisplay = ({ value }: { value: boolean }) => {
  return <>{value ? <Lock color="info" /> : <LockOpen color="info" />}</>;
};

export default RoomStatusDisplay;
