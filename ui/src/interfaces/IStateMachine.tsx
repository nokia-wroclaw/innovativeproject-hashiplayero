interface IStateMachine {
  inWaitingRoom: boolean;
  isAdmin: boolean;
  inSingleGame: boolean;
  inMultiGame: boolean;
  isBoardCorrect: boolean;
}

export default IStateMachine;
