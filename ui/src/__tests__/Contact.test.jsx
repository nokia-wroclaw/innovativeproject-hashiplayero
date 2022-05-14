import {render} from '@testing-library/react'
import Contact from '../components/Contact'

test('Contact renders without crashing', ()=>{
    render(<Contact/>)
})

test('Contact renders with correct components', ()=>{
    const {getByText, getAllByRole} = render(<Contact/>)
    getByText('Contact us')
    getByText('We\'re all ears.')
    getByText('Our team members emails:')
    const emails = getAllByRole('link')
    expect(emails).toHaveLength(6)
})