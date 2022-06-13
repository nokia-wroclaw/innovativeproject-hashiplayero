import Grid from "@mui/material/Grid";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from '@mui/icons-material/GitHub';

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
        <h3 className="contact-title">Star us at GitHub</h3>
        <a href="https://github.com/nokia-wroclaw/innovativeproject-hashiplayero" target="_blank"
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center"
          }}>
          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.onlinewebfonts.com%2Fsvg%2Fimg_326384.png&f=1&nofb=1" alt="github logo"
            style={{ maxWidth: "25%", alignContent: "center", padding: "16px" }}
          />
        </a>
        {/* <Grid
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
        </Grid> */}
      </div>
    </>
  );
};

export default Contact;
