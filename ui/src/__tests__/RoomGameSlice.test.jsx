import reducer, { updateRoomGame } from '../store/RoomGameSlice'


test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
        {
            roomAndBoard: {
                name: "name",
                boardID: -1,
                maxPlayers: -1,
                isPrivate: false,
                password: "",
                timeLimit: -1,
                members: [],
                array: [],
                admin: "",
                gameOn: false,
                settings: {
                    difficulty: -1,
                    size: -1,
                },
                gameData: [],
                bridges: [],
            },
        }
    )
})

test('should update room and board in game with correct data', () => {
    const state = {
        roomAndBoard: {
            name: "name",
            boardID: -1,
            maxPlayers: -1,
            isPrivate: false,
            password: "password",
            timeLimit: -1,
            members: [],
            array: [],
            admin: "",
            gameOn: false,
            settings: {
                difficulty: -1,
                size: -1,
            },
            gameData: [],
            bridges: [],
        },
    }
    expect(reducer(state, updateRoomGame({
        roomAndBoard: {
            name: "pokoj",
            boardID: 3,
            maxPlayers: 2,
            isPrivate: false,
            password: "12345",
            timeLimit: 3,
            members: [],
            array: [],
            admin: "",
            gameOn: false,
            settings: {
                difficulty: 3,
                size: 5,
            },
            gameData: [],
            bridges: [],
        },
    }))).toEqual({
        roomAndBoard: {
            name: "pokoj",
            boardID: 3,
            maxPlayers: 2,
            isPrivate: false,
            password: "12345",
            timeLimit: 3,
            members: [],
            array: [],
            admin: "",
            gameOn: false,
            settings: {
                difficulty: 3,
                size: 5,
            },
            gameData: [],
            bridges: [],
        },
    })
})
