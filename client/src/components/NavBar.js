import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? "h5" : "h7"}
      noWrap
      style={{
        marginRight: "30px",
        fontFamily: "Helvetica",
        fontWeight: 700,
        // letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: "inherit",
          textDecoration: "none",
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

export default function NavBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <NavLink
            to="/"
            style={{
              marginRight: "30px",
              fontFamily: "Helvetica",
              fontWeight: 700,
              // letterSpacing: '.3rem',
            }}
          >
            <img
              src="/navbarLogo.png"
              alt="HomePros Logo"
              style={{ height: "40px" , marginTop:"6px"}}
            />
          </NavLink>
          <NavText href="/cities" text="Cities" />
          <NavText href="/states" text="States" />
          {/* <NavText href="/compare" text="Compare" /> */}
          <NavText href="/advancedsearch" text="Advanced Search" />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
