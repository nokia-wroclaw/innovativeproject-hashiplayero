import {
    Grid,
    Box,
    Container,
    AppBar,
    Link,
} from "@mui/material";

const Footer = () => {

    interface Page {
        name: string;
        path: string;
    }

    const about: Page[] = [
        { name: "Rules", path: "/rules" },
        { name: "Faq", path: "/faq" },
    ];

    const support: Page[] = [
        { name: "Contact", path: "/contact" },
        { name: "Github", path: "https://github.com/nokia-wroclaw/innovativeproject-hashiplayero" },
    ]

    return (
        <AppBar position="static" sx={{ height: 100 }} style={{ background: "white" }}>
            <Container maxWidth="xl">
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{my: 3.5}}>
                            <p> &reg;{new Date().getFullYear()} HashiPlayero </p>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box borderBottom={1}>About</Box>
                        {about.map((links, index) => (
                            <Box
                            key={index}>
                                <Link
                                    href={links.path}
                                    underline="none">
                                    {links.name}
                                </Link>
                            </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box borderBottom={1}>Support</Box>
                        {support.map((links,index) => (
                            <Box
                            key={index}>
                                <Link
                                    href={links.path}
                                    underline="none">
                                    {links.name}
                                </Link>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </AppBar>
    )
}

export default Footer;