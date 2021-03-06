import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import HeaderBar from '../components/HeaderBar';
import { store } from "../store/store";
import { Provider } from 'react-redux'

test('HeaderBar renders without crashing', async () => {
    const history = createMemoryHistory()
    render(
        <Router location={history.location} navigator={history}>
            <Provider store={store}>
                <HeaderBar />
            </Provider>
        </Router>,
    )
})

test('HeaderBar renders with correct components', async () => {
    const history = createMemoryHistory()
    const { getByText } = render(
        <Router location={history.location} navigator={history}>
            <Provider store={store}>
                <HeaderBar />
            </Provider>
        </Router>,
    )
    getByText('Hashi')
    getByText('Playero')
    // Verify header content (Five active buttons)
    const items = await screen.findAllByRole('button')
    expect(items).toHaveLength(6)
})

test('HeaderBar logo changes color', async () => {
    const history = createMemoryHistory()
    const { getByRole } = render(
        <Router location={history.location} navigator={history}>
            <Provider store={store}>
                <HeaderBar />
            </Provider>
        </Router>,
    )

    const logoFirstHalf = getByRole("heading", { name: /hashi/i })
    expect(logoFirstHalf).toHaveStyle('color: 5452E4')
    fireEvent.mouseOver(logoFirstHalf)
    expect(logoFirstHalf).toHaveStyle('color: 7081A6')

    const logoSecondHalf = getByRole("heading", { name: /playero/i })
    expect(logoSecondHalf).toHaveStyle('color: 7081A6')
    fireEvent.mouseOver(logoSecondHalf)
    expect(logoSecondHalf).toHaveStyle('color: 5452E4')
})