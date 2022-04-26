import React from "react";

const Contact = () => {

    const emails = [
        "email1", 
        "email2", 
        "email3" //Add team members' emails
    ]

    return (
        <>
            <h1>Contact</h1>
            <h3>We're all ears.</h3>
            <h5>In case you find any problems, or you would like to contacts us about anything, go ahead and do it.</h5>
            <p>Our team members emails:</p>
            {
                emails.map((e) => (
                    <ul>{e}</ul>
                ))
            }
        </>
    );
};

export default Contact;