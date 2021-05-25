import React from "react";
import moment from "moment";

import Loader from "../Loader";
import BetCard from "../Bets/bet-card";
import { Button, Fab, Grid, Typography } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

const extendBetResult = (res) =>
  res.data
    .map((bet) => {
      // Add isFinished and hasResult
      const kickoff = moment(bet.kickoff);
      const isFinished = moment().add("105", "minutes").isAfter(kickoff);
      const hasResult = bet.home.result !== null && bet.away.result !== null;
      return { ...bet, isFinished, hasResult };
    })
    // Sort on kickoff then on is finished
    .sort((a, b) => moment.utc(a.kickoff).diff(moment.utc(b.kickoff)))
    .sort((a, b) => (b.isFinished === a.isFinished ? 0 : b.isFinished ? 1 : -1))
    .sort((a, b) => (b.hasResult === a.hasResult ? 0 : b.hasResult ? -1 : 1));

function Admin({ firebase }) {
  const [adminBets, setAdminBets] = React.useState(null);
  const [originalBets, setOriginalBets] = React.useState(null);

  const snackbar = useSnackbar();

  React.useEffect(() => {
    async function getAdmin() {
      const get = firebase.functions.httpsCallable("admin");
      const res = await get();
      const data = extendBetResult(res);

      setAdminBets(data);
      setOriginalBets(JSON.parse(JSON.stringify(data)));
    }
    getAdmin();
  }, [firebase.functions]);

  const saveBets = () => {
    const isPristine = (bet) => {
      const originalBet = originalBets.find(
        (x) =>
          x.away.team === bet.away.team &&
          x.home.team === bet.home.team &&
          x.group === bet.group &&
          x.stage === bet.stage
      );
      return (
        bet.home.result == originalBet.home.result &&
        bet.away.result == originalBet.away.result
      );
    };

    // If one result is set other is null then we set 0
    const filteredBets = adminBets
      .map((x) => {
        if (x.home.result != null && x.away.result == null) {
          return { ...x, away: { ...x.away, result: 0 } };
        }
        if (x.home.result == null && x.away.result != null) {
          return { ...x, home: { ...x.home, result: 0 } };
        }
        return x;
      })
      .filter(
        (x) => x.home.result != null && x.away.result != null && !isPristine(x)
      );
    filteredBets.forEach((x) => {
      if (x.home.result < 0 || x.away.result < 0) {
        return alert("Negativt resultat i match");
      }
    });
    if (filteredBets.length == 0) {
      return;
    }
    const saveResults = firebase.functions.httpsCallable("saveResults");
    saveResults({ bets: filteredBets })
      .then((res) => {
        console.log(res);
        const data = extendBetResult(res);
        setAdminBets(data);
        snackbar.showMessage("Resultat sparat");
      })
      .catch((error) => {
        console.error("onRejected function called: " + error.message);
        snackbar.showMessage("Misslyckades med att spara");
      });
  };
  const handleOnChange = (val) => {
    let bet = adminBets.find((x) => val === x);
    bet = val;
    console.log(bet);
    setAdminBets(adminBets);
  };
  return !adminBets ? (
    <Loader />
  ) : (
    <Grid
      container
      direction="column"
      justify="space-between"
      alignItems="center"
    >
      {adminBets.length ? (
        <>
          <Fab
            style={{
              margin: 0,
              top: "auto",
              right: 20,
              bottom: 20,
              left: "auto",
              position: "fixed",
            }}
            variant="contained"
            color="primary"
            onClick={() => saveBets()}
          >
            Spara
          </Fab>
          <Grid item xs={12}>
            <Typography variant={"h4"} style={{ marginBottom: "15px" }}>
              Tippa
            </Typography>
          </Grid>

          {adminBets.map((bet, i) => {
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
      ) : null}
    </Grid>
  );
}
export default Admin;
