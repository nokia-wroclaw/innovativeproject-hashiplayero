import {fireEvent, getByTestId, render} from '@testing-library/react'
import Faq from '../components/Faq'

test('Faq renders without crashing', ()=>{
    render(<Faq/>)
})

test('Faq renders with correct components', ()=>{
    const {getAllByTestId} = render(<Faq/>)

    // Check if there is a correct amount of questions
    const faqHeaders = getAllByTestId(/faq-question/i)
    expect(faqHeaders).toHaveLength(5)
})

// Problem with user-event
// https://github.com/testing-library/user-event/issues/839
// Used fireEvent instead

test('Faq components behave in a correct way', ()=>{
    const {getByTestId} = render(<Faq/>)

    // Check if questions aren't expanded by default
    const faqHeader = getByTestId(`faq-question-0`)
    expect(faqHeader).not.toHaveClass('Mui-expanded')
    // Check if questions are expanded after being cliked
    fireEvent.click(faqHeader)
    expect(faqHeader).toHaveClass('Mui-expanded')
})
