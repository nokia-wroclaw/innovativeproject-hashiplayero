import reducer, { changeWaitingRoom, changeAdmin, changeMultiGame, changeSingleGame, changeBoardCorrect } from '../store/StateMachineSlice'


test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
        {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: false,
        }
    )
})

test('should return change waiting room state', () => {
    const state = {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: false
    }
    expect(reducer(state, changeWaitingRoom(true))).toEqual(
        {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: true,
            isAdmin: false,
            isBoardCorrect: false
        }
    )
})

test('should return change admin state', () => {
    const state = {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: false
    }
    expect(reducer(state, changeAdmin(true))).toEqual(
        {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: true,
            isBoardCorrect: false
        }
    )
})

test('should return change multi game state', () => {
    const state = {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: false
    }
    expect(reducer(state, changeMultiGame(true))).toEqual(
        {
            inMultiGame: true,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: false
        }
    )
})

test('should return change single game state', () => {
    const state = {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: false
    }
    expect(reducer(state, changeSingleGame(true))).toEqual(
        {
            inMultiGame: false,
            inSingleGame: true,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: false
        }
    )
})

test('should return change single game state', () => {
    const state = {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: false
    }
    expect(reducer(state, changeBoardCorrect(true))).toEqual(
        {
            inMultiGame: false,
            inSingleGame: false,
            inWaitingRoom: false,
            isAdmin: false,
            isBoardCorrect: true
        }
    )
})
