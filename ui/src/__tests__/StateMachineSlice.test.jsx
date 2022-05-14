import reducer, { enterRoom, exitRoom, enterAdmin, exitAdmin } from '../store/StateMachineSlice'


test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
        {
            inRoom: false,
            isAdmin: false,
        }
    )
    expect(reducer(undefined, {})).not.toEqual(
        {
            inRoom: true,
            isAdmin: false,
        }
    )
})

test('should return enter room state', () => {
    const previousState = {
        inRoom: false,
        isAdmin: false
    }
    expect(reducer(previousState, enterRoom())).toEqual(
        {
            inRoom: true,
            isAdmin: previousState.isAdmin,
        }
    )
    expect(reducer(previousState, enterRoom())).not.toEqual(
        {
            inRoom: false,
            isAdmin: previousState.isAdmin,
        }
    )
})

test('should return exit room state', () => {
    const previousState = {
        inRoom: true,
        isAdmin: true
    }
    expect(reducer(previousState, exitRoom())).toEqual(
        {
            inRoom: false,
            isAdmin: previousState.isAdmin,
        }
    )
    expect(reducer(previousState, exitRoom())).not.toEqual(
        {
            inRoom: true,
            isAdmin: previousState.isAdmin,
        }
    )
})

test('should return enter admin state', () => {
    const previousState = {
        inRoom: true,
        isAdmin: false
    }
    expect(reducer(previousState, enterAdmin())).toEqual(
        {
            inRoom: true,
            isAdmin: true,
        }
    )
    expect(reducer(previousState, enterAdmin())).not.toEqual(
        {
            inRoom: true,
            isAdmin: false,
        }
    )
})

test('should return exit admin state', () => {
    const previousState = {
        inRoom: true,
        isAdmin: true
    }
    expect(reducer(previousState, exitAdmin())).toEqual(
        {
            inRoom: true,
            isAdmin: false,
        }
    )
    expect(reducer(previousState, exitAdmin())).not.toEqual(
        {
            inRoom: true,
            isAdmin: previousState.isAdmin,
        }
    )
})

