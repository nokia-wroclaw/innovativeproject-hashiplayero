import Grid from "@mui/material/Grid";
import EmailIcon from "@mui/icons-material/Email";

interface IContactInfo {
  email: string;
  person: string;
  id: number;
}
const Contact = () => {
  const contactInfo: IContactInfo[] = [
    {
      email: "test@gmail.com",
      person: "John Doe",
      id: 1,
    },
    {
      email: "test2@gmail.com",
      person: "Jane Doe",
      id: 2,
    },
    {
      email: "test3@gmail.com",
      person: "John Smith",
      id: 3,
    },
    {
      email: "test4@gmail.com",
      person: "Jane Smith",
      id: 4,
    },
    {
      email: "test5@gmial.com",
      person: "John Kowalski",
      id: 5,
    },
    {
      email: "test6@gmail.com",
      person: "Jane Kowalski",
      id: 6,
    },
  ];
  return (
    <>
      <div className="paper contact">
        <div className="title">
          <h1>Contact us</h1>
          <EmailIcon />
        </div>
        <h3 className="sub-title">We're all ears.</h3>
        <span className="contact-text">
          In case you find any problems, or you would like to contacts us about
          anything, go ahead and do it. We're always happy to hear from you, but we are
          no magicians.
        </span>
        <h3 className="contact-title">Our team members emails:</h3>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className="contact-people"
        >
          {contactInfo.map((information) => (
            <div key={information.id} className="contact-person">
              <span>{information.person}</span>
              <br />
              <a href="#">{information.email}</a>
            </div>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default Contact;
