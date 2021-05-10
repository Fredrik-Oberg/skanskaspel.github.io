import React from "react";
import moment from "moment";

import { Button, Grid } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import BetCard from "./bet-card";
import Loader from "../Loader";

function Bets({ firebase }) {
  const [bets, setBets] = React.useState(null);
  const snackbar = useSnackbar();

  React.useEffect(() => {
    async function getBets() {
      const get = firebase.functions.httpsCallable("bets");
      const res = await get();
      const data = res.data.map((x) => {
        const kickoff = moment(x.kickoff);
        const isFinished = moment().add("3", "hours").isAfter(kickoff);
        return { ...x, isFinished };
      });
      const sortedData = data
        .sort((a, b) => moment.utc(a.kickoff).diff(moment.utc(b.kickoff)))
        .sort((a, b) =>
          b.isFinished === a.isFinished ? 0 : b.isFinished ? -1 : 1
        );
      setBets(sortedData);
    }
    getBets();
  }, [firebase.functions]);
  const saveBets = () => {
    console.log(bets);
    bets.forEach((x) => {
      if (x.home.result < 0 || x.away.result < 0) {
        return alert("Negativt resultat i match");
      }
    });
    // todo check for error
    const saveBets = firebase.functions.httpsCallable("saveBets");
    saveBets({ bets: bets })
      .then((result) => {
        console.log(result);
        setBets(result.data);
        snackbar.showMessage("Spel sparat");
      })
      .catch((error) => {
        console.error("onRejected function called: " + error.message);
        snackbar.showMessage("Misslyckades med att spara");
      });
  };
  const handleOnChange = (val) => {
    let bet = bets.find((x) => val === x);
    // eslint-disable-next-line no-unused-vars
    bet = val;
    setBets(bets);
  };
  return (
    <Grid item zeroMinWidth>
      {!bets ? (
        <Loader />
      ) : (
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
        >
          {bets.length ? (
            <>
              <Grid item style={{ marginBottom: "15px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => saveBets()}
                >
                  Spara
                </Button>
              </Grid>

              {bets.map((bet, i) => {
                return (
                  <Grid item>
                    <BetCard
                      bet={bet}
                      key={bet.kickoff + i}
                      onChange={handleOnChange}
                    />
                  </Grid>
                );
              })}
            </>
          ) : (
            <Grid item>
              <h3>Här var det tomt. Vänta lite och prova sen att ladda om</h3>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default Bets;
