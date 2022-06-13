import Rules from '../components/Rules'
import { render} from '@testing-library/react'

test('Rules renders without crashing', ()=>{
    render(<Rules/>)
})

test('Rules renders with correct components', ()=>{
    const {getByText} = render(<Rules/>)
    getByText('Rules')
})