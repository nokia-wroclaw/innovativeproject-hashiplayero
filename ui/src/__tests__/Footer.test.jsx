import {render} from '@testing-library/react'
import Footer from '../components/Footer'

test('Footer renders without crashing', ()=>{
    render(<Footer/>)
})

test('Contact renders with correct components', ()=>{
    const {getByText, getAllByRole} = render(<Footer/>)
    getByText(/HashiPlayero/)
    getByText('About')
    getByText('Support')
    const links = getAllByRole('link')
    expect(links).toHaveLength(4)
})