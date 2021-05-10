// import "./App.css";
import React from "react";
import Bets from "./components/Bets";
import CurrentBets from "./components/CurrentBets";
import UserProfile from "./components/UserProfile";
import { AppBar, Tabs, Tab, Typography, Box, Grid } from "@material-ui/core";
import Result from "./components/Result";
import Admin from "./components/Admin";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function Home({ firebase }) {
  const [value, setValue] = React.useState(0);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    async function getClaims() {
      firebase.auth.currentUser
        .getIdTokenResult()
        .then((idTokenResult) => {
          console.log(idTokenResult);
          // Confirm the user is an Admin.
          if (!!idTokenResult.claims.admin) {
            setIsAdmin(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getClaims();
  }, [firebase]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs panel"
          style={{ backgroundColor: "#e23d28" }}
          variant="scrollable"
          scrollButtons="on"
          TabIndicatorProps={{ style: { background: "#f7dd16" } }}
        >
          <Tab label="Spel" {...a11yProps(0)} />
          <Tab label="Pågående" {...a11yProps(1)} />
          <Tab label="Ställning" {...a11yProps(2)} />
          <Tab label="Regler" {...a11yProps(3)} />
          <Tab label="Mina inställningar" {...a11yProps(4)} />
          {isAdmin && <Tab label="Admin" {...a11yProps(5)} />}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Bets firebase={firebase} />
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container direction="column" justify="center" alignItems="center">
          <CurrentBets firebase={firebase} />
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Result firebase={firebase} />
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <span>Rules</span>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Grid container direction="column" justify="center" alignItems="center">
          <UserProfile firebase={firebase} />
        </Grid>
      </TabPanel>
      {isAdmin && (
        <TabPanel value={value} index={5}>
          <Admin firebase={firebase} />
        </TabPanel>
      )}
    </>
  );
}

export default Home;
