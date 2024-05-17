import React from 'react';
import moment from 'moment';

import { CircularProgress, Fab, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'material-ui-snackbar-provider';

import BetCard from './bet-card';
import Loader from '../Loader';
import SaveIcon from '@mui/icons-material/Save';

const useStyles = makeStyles((theme) => ({
  fabWrapper: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  fabProgress: {
    color: 'secondary',
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
}));

const extendBetResult = (res) =>
  res.data
    .map((bet) => {
      // Add isFinished, hasStarted and hasResult
      const kickoff = moment(bet.kickoff);
      const now = moment().unix() * 1000;
      const betAdded3h = kickoff.add(3, 'hours').unix() * 1000;

      const hasStarted = bet.kickoff <= now;
      const isFinished = betAdded3h < now;
      const hasResult = bet.home.result !== null && bet.away.result !== null;
      return { ...bet, isFinished, hasStarted, hasResult };
    })
    // Sort on kickoff
    .sort((a, b) => a.kickoff - b.kickoff);

function Bets({ firebase }) {
  const [bets, setBets] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [originalBets, setOriginalBets] = React.useState(null);
  const snackbar = useSnackbar();
  const classes = useStyles();

  React.useEffect(() => {
    async function getBets() {
      const get = firebase.functions.httpsCallable('bets');
      const res = await get();
      if (res) {
        const data = extendBetResult(res);
        setBets(data);
        // Deep copy
        setOriginalBets(JSON.parse(JSON.stringify(data)));
      } else {
        snackbar.showMessage('Misslyckades med att hämta bets');
      }
    }
    getBets();
  }, [firebase.functions]);

  const saveBets = () => {
    setIsSaving(true);
    const isPristine = (bet) => {
      const originalBet = originalBets.find(
        (x) =>
          x.away.team === bet.away.team &&
          x.home.team === bet.home.team &&
          x.group === bet.group &&
          x.stage === bet.stage,
      );
      return bet.home.result == originalBet.home.result && bet.away.result == originalBet.away.result;
    };
    // If one result is set other is null then we set 0
    const changedBets = bets
      .map((x) => {
        if (x.home.result != null && (x.away.result == null || x.away.result === '')) {
          return { ...x, away: { ...x.away, result: 0 } };
        }
        if (x.away.result != null && (x.home.result == null || x.home.result === '')) {
          return { ...x, home: { ...x.home, result: 0 } };
        }
        return x;
      })
      .filter((x) => x.home.result != null && x.away.result != null && !isPristine(x));
    changedBets.forEach((x) => {
      if (x.home.result < 0 || x.away.result < 0) {
        return alert('Negativt resultat i match');
      }
    });
    if (changedBets.length == 0) {
      setIsSaving(false);
      return;
    }
    // TODO check for error
    const saveBets = firebase.functions.httpsCallable('saveBets');
    saveBets({ bets: changedBets })
      .then((res) => {
        const data = extendBetResult(res);
        setBets(data);
        snackbar.showMessage('Spel sparat');
        setIsSaving(false);
      })
      .catch((error) => {
        console.error('onRejected function called: ' + error.message);
        //TODO should be error color
        snackbar.showMessage('Misslyckades med att spara');
        setIsSaving(false);
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
        <Grid container direction="column" justify="space-evenly" alignItems="center">
          {bets.length ? (
            <>
              <div className={classes.fabWrapper}>
                <Fab variant="round" color="primary" disabled={isSaving} onClick={() => saveBets()}>
                  <SaveIcon />
                </Fab>
                {isSaving && <CircularProgress className={classes.fabProgress} size={68} color={'secondary'} />}
              </div>
              {bets.filter((x) => x.hasStarted && !x.isFinished).length != 0 && (
                <Grid item xs={12}>
                  <Typography variant={'h5'} style={{ marginBottom: '15px' }}>
                    {'Pågående'}
                  </Typography>
                </Grid>
              )}
              {bets
                .map((bet, i) => {
                  if (bet.hasStarted && !bet.isFinished) {
                    return (
                      <Grid>
                        <BetCard disableIfStarted bet={bet} key={bet.kickoff + i + bet.hasResult} onChange={() => {}} />
                      </Grid>
                    );
                  }
                  return false;
                })
                .filter(Boolean)}
              {/* TODO issue när alla matcher har startat */}
              <Grid item xs={12}>
                <Typography variant={'h5'} style={{ marginBottom: '15px' }}>
                  Tippa
                </Typography>
              </Grid>

              {bets
                .map((bet, i) => {
                  if (bet.isFinished || bet.hasStarted) return false;
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
                  <Typography variant={'h5'} style={{ marginBottom: '15px' }}>
                    {'Färdigspelade'}
                  </Typography>
                </Grid>
              )}
              {bets
                .map((bet, i) => {
                  if (bet.isFinished) {
                    return (
                      <Grid>
                        <BetCard disableIfStarted bet={bet} key={bet.kickoff + i + bet.hasResult} onChange={() => {}} />
                      </Grid>
                    );
                  }
                  return false;
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
