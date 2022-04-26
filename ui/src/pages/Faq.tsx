import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Faq = () => {

    const faq = [
        {
            question: "What is HashiPlayero?",
            answer: "It's a web application where you can play a game of Hashiwokakero (Build bridges). " +
                "During the game, player is given a puzzle, which contains islands and bridges. " +
                "In order to solve a puzzle, player has to connect islands in a correct way. " +
                "Check \"RULES\" to learn about specific rules of this game."
        },
        {
            question: "How can I play it?",
            answer: "You can play it either in single or multiplayer mode. Just go ahead and enter given mode via main menu."
        },
        {
            question: "Who made it?",
            answer: "This application was made by group of students from Wroclaw University of Science and Technology under supervision from Nokia Wroclaw employees. "
        },
        {
            question: "How can I report a bug?",
            answer: "In case you find any probelms with application, go ahead and check our Contact page, in order to contact us."
        },
    ];

    return (
        <>
            <h1>FAQ</h1>
            {
                faq.map((f, index) => (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <h5>{f.question}</h5>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>{f.answer}</p>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </>
    );
};

export default Faq;