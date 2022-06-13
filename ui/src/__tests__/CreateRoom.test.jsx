import { fireEvent, getByText, render } from "@testing-library/react";
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { store } from "../store/store";
import { Provider } from 'react-redux'
import CreateRoom from '../pages/CreateRoom'


test('CreateRoom renders with correct components', () => {
    const history = createMemoryHistory()
    const { getByRole, getAllByRole, getByText } = render(
        <Router location={history.location} navigator={history}>
            <Provider store={store}>
                <CreateRoom />
            </Provider>
        </Router>
    )
    getByRole("textbox", { name: /room name/i })
    getByRole("textbox", { name: /password/i })
    getByRole("button", { name: /password visibility/i })
    getByRole("slider", { name: /custom/i })
    getAllByRole("button", { name: /easy/i })
    getAllByRole("button", { name: /small/i })
    const createButton = getByRole("button", { name: /create!/i })

    fireEvent.click(createButton)
    getByText("Room name cannot be empty!")

})
