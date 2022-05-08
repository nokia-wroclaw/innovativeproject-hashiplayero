import {render, screen} from '@testing-library/react'
import {createMemoryHistory} from 'history'
import {Router} from 'react-router-dom'
import HeaderBar from '../components/HeaderBar';

test('HeaderBar renders without crashing', async () => {
    const history = createMemoryHistory()
    render(
        <Router location={history.location} navigator={history}>
            <HeaderBar />
        </Router>,
    )
})

test('HeaderBar renders with correct components', async () => {
    const history = createMemoryHistory()
    const {getByText} = render(
        <Router location={history.location} navigator={history}>
            <HeaderBar />
        </Router>,
    )
    getByText('Hashi')
    getByText('Playero')
    // Verify header content (Five active buttons)
    const items = await screen.findAllByRole('button')
    expect(items).toHaveLength(5)
})
