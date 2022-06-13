import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuizIcon from "@mui/icons-material/Quiz";

interface IFaq {
  question: string;
  answer: string;
  id: number;
}

const Faq = () => {
  const faq: IFaq[] = [
    {
      question: "What is HashiPlayero?",
      answer:
        "It's a web application where you can play a game of Hashiwokakero (Build bridges). " +
        "During the game, player is given a puzzle, which contains islands and bridges. " +
        "In order to solve a puzzle, player has to connect islands in a correct way. " +
        'Check "RULES" to learn about specific rules of this game.',
      id: 0,
    },
    {
      question: "How can I play it?",
      answer:
        "You can play it either in single or multiplayer mode. Just go ahead " +
        " and enter given mode via main menu.",
      id: 1,
    },
    {
      question: "Who made it?",
      answer:
        "This application was made by group of students from Wroclaw University of Science " +
        " and Technology under supervision from Nokia Wroclaw employees. ",
      id: 2,
    },
    {
      question: "How can I report a bug?",
      answer:
        "In case you find any probelms with application, go ahead and check our Contact page, in order to contact us.",
      id: 3,
    },
  ];

  return (
    <>
      <div className="faq-container" data-testid="faq-container">
        <div className="title">
          <h1>FAQ</h1>
          <QuizIcon />
        </div>
        <div className="faq-questions" data-testid="faq-questions">
          {faq.map((item) => (
            <Accordion key={item.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                data-testid="faq-subtitle"
              >
                <h5 className="sub-title">{item.question}</h5>
              </AccordionSummary>
              <AccordionDetails>
                <p data-testid="faq-answer">{item.answer}</p>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </>
  );
};

export default Faq;
