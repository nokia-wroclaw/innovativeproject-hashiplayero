import {fireEvent, getAllByTestId, render} from '@testing-library/react'
import Faq from '../components/Faq'

test('Faq renders without crashing', ()=>{
    render(<Faq/>)
})

test('Faq renders with correct components', ()=>{
    const {getAllByTestId} = render(<Faq/>)

    // Check if there is a correct amount of questions
    const faqHeaders = getAllByTestId('faq-subtitle')
    expect(faqHeaders).toHaveLength(4)
})

// Problem with user-event
// https://github.com/testing-library/user-event/issues/839
// Used fireEvent instead

test('Faq components behave in a correct way', ()=>{
    const {getAllByTestId} = render(<Faq/>)

    // Check if questions aren't expanded by default
    const faqHeaders = getAllByTestId('faq-subtitle')
    expect(faqHeaders[0]).not.toHaveClass('Mui-expanded')
    // Check if questions are expanded after being cliked
    fireEvent.click(faqHeaders[0])
    expect(faqHeaders[0]).toHaveClass('Mui-expanded')
})
