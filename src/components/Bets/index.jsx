import React from "react";
import moment from "moment";

import { Fab, Grid, Typography } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import BetCard from "./bet-card";
import Loader from "../Loader";

const extendBetResult = (res) =>
  res.data
    .map((bet) => {
      // Add isFinished and hasResult
      const kickoff = moment(bet.kickoff);
      const isFinished = moment().add("3", "hours").isAfter(kickoff);
      const hasResult = bet.home.result !== null && bet.away.result !== null;
      return { ...bet, isFinished, hasResult };
    })
    // Sort on kickoff then on is finished
    .sort((a, b) => moment.utc(a.kickoff).diff(moment.utc(b.kickoff)))
    .sort((a, b) =>
      b.isFinished === a.isFinished ? 0 : b.isFinished ? -1 : 1
    );

function Bets({ firebase }) {
  const [bets, setBets] = React.useState(null);
  const [originalBets, setOriginalBets] = React.useState(null);
  const snackbar = useSnackbar();

  React.useEffect(() => {
    async function getBets() {
      const get = firebase.functions.httpsCallable("bets");
      const res = await get();
      const data = extendBetResult(res);
      setBets(data);
      setOriginalBets(JSON.parse(JSON.stringify(data)));
    }
    getBets();
  }, [firebase.functions]);

  const saveBets = () => {
    console.log(bets);
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
    const changedBets = bets
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
    changedBets.forEach((x) => {
      if (x.home.result < 0 || x.away.result < 0) {
        return alert("Negativt resultat i match");
      }
    });
    if (changedBets.length == 0) {
      return;
    }
    // TODO check for error
    const saveBets = firebase.functions.httpsCallable("saveBets");
    saveBets({ bets: changedBets })
      .then((res) => {
        const data = extendBetResult(res);
        setBets(data);
        snackbar.showMessage("Spel sparat");
      })
      .catch((error) => {
        console.error("onRejected function called: " + error.message);
        //TODO should be error color
        snackbar.showMessage("Misslyckades med att spara");
      });
  };
  const handleOnChange = (val) => {
    let bet = bets.find((x) => val === x);
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
          justify="space-evenly"
          alignItems="center"
        >
          {bets.length ? (
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
              {bets.filter((x) => !x.isFinished).length != 0 && (
                <Grid item xs={12}>
                  <Typography variant={"h4"} style={{ marginBottom: "15px" }}>
                    Tippa
                  </Typography>
                </Grid>
              )}

              {bets
                .map((bet, i) => {
                  if (bet.isFinished) return false;
                  return (
                    <Grid>
                      <BetCard
                        disableIfStarted
                        bet={bet}
                        key={bet.kickoff + i + bet.hasResult}
                        onChange={handleOnChange}
                      />
                    </Grid>
                  );
                })
                .filter(Boolean)}
              {bets.filter((x) => x.isFinished).length != 0 && (
                <Grid item xs={12}>
                  <Typography variant={"h4"} style={{ marginBottom: "15px" }}>
                    Startade matcher
                  </Typography>
                </Grid>
              )}
              {bets
                .map((bet, i) => {
                  if (!bet.isFinished) return false;
                  return (
                    <Grid>
                      <BetCard
                        disableIfStarted
                        bet={bet}
                        key={bet.kickoff + i + bet.hasResult}
                        onChange={() => {}}
                      />
                    </Grid>
                  );
                })
                .filter(Boolean)}
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
