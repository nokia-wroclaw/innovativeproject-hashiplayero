import reducer, { enterRoom, exitRoom, enterAdmin, exitAdmin } from '../store/StateMachineSlice'


test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
        {
            inRoom: false,
            isAdmin: false,
        }
    )
})

test('should return enter room state', () => {
    const state = {
        inRoom: false,
        isAdmin: false
    }
    expect(reducer(state, enterRoom())).toEqual(
        {
            inRoom: true,
            isAdmin: state.isAdmin,
        }
    )
})

test('should return exit room state', () => {
    const state = {
        inRoom: true,
        isAdmin: true
    }
    expect(reducer(state, exitRoom())).toEqual(
        {
            inRoom: false,
            isAdmin: state.isAdmin,
        }
    )
})

test('should return enter admin state', () => {
    const state = {
        inRoom: true,
        isAdmin: false
    }
    expect(reducer(state, enterAdmin())).toEqual(
        {
            inRoom: true,
            isAdmin: true,
        }
    )
})

test('should return exit admin state', () => {
    const state = {
        inRoom: true,
        isAdmin: true
    }
    expect(reducer(state, exitAdmin())).toEqual(
        {
            inRoom: true,
            isAdmin: false,
        }
    )
})

