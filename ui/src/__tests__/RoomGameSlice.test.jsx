import reducer, {  updateRoomGame  } from '../store/RoomGameSlice'


test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
        {
            roomAndBoard: {
                name: "name",
                maxPlayers: -1,
                isPrivate: false,
                password: "password",
                timeLimit: -1,
                members: [],
                array: [],
                admin: "",
                settings: {
                    difficulty: -1,
                    size: -1,
                },
            },
        }
    )
})

test('should update room in game with correct data', () => {
    const previousState = {
        roomAndBoard: {
            name: "name",
            maxPlayers: -1,
            isPrivate: false,
            password: "password",
            timeLimit: -1,
            members: [],
            array: [],
            admin: "",
            settings: {
                difficulty: -1,
                size: -1,
            },
        },
    }
    expect(reducer(previousState, updateRoomGame({
        roomAndBoard: {
            name: "TEST-mdnliu1g23o1",
            maxPlayers: 5,
            isPrivate: false,
            password: "pjo1ui231",
            timeLimit: 10,
            members: [],
            array: [],
            admin: "h1b3yu1234k1324bk",
            settings: {
                difficulty: 3,
                size: 5,
            },
        },
    }))).toEqual({
        roomAndBoard: {
            name: "TEST-mdnliu1g23o1",
            maxPlayers: 5,
            isPrivate: false,
            password: "pjo1ui231",
            timeLimit: 10,
            members: [],
            array: [],
            admin: "h1b3yu1234k1324bk",
            settings: {
                difficulty: 3,
                size: 5,
            },
        },
    })
    expect(reducer(previousState, updateRoomGame({
        roomAndBoard: {
            name: "TEST-mdnliu1g23o1",
            maxPlayers: 5,
            isPrivate: false,
            password: "pjo1ui231",
            timeLimit: 10,
            members: [],
            array: [],
            admin: "h1b3yu1234k1324bk",
            settings: {
                difficulty: 3,
                size: 5,
            },
        },
    }))).not.toEqual({
        roomAndBoard: {
            name: "323",
            maxPlayers: 5,
            isPrivate: false,
            password: "deewd",
            timeLimit: 10,
            members: [],
            array: [],
            admin: "h123d",
            settings: {
                difficulty: 3,
                size: 5,
            },
        },
    })
})
