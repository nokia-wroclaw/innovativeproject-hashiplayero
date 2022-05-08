import Rules from '../components/Rules'
import {getAllByAltText, render} from '@testing-library/react'

test('Rules renders without crashing', ()=>{
    render(<Rules/>)
})

test('Rules renders with correct components', ()=>{
    const {getByText, getAllByAltText} = render(<Rules/>)
    getByText('Rules')
    const rulePhotos = getAllByAltText('Rule pic')
    expect(rulePhotos).toHaveLength(4)
})