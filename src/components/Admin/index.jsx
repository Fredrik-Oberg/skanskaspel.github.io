import React from 'react';
import moment from 'moment';

import Loader from '../Loader';
import BetCard from '../Bets/bet-card';
import { CircularProgress, Fab, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SaveIcon from '@mui/icons-material/Save';

import { useSnackbar } from 'material-ui-snackbar-provider';

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
      const betAdded105m = kickoff.add('105', 'minutes').unix() * 1000;

      const hasStarted = bet.kickoff <= now;
      const isFinished = betAdded105m < now;
      const hasResult = bet.home.result !== null && bet.away.result !== null;
      return { ...bet, isFinished, hasStarted, hasResult };
    })
    .sort((a, b) => a.kickoff - b.kickoff)
    // Sort on kickoff then on is finished
    .sort((a, b) => (b.isFinished === a.isFinished ? 0 : b.isFinished ? 1 : -1))
    .sort((a, b) => (b.hasResult === a.hasResult ? 0 : b.hasResult ? -1 : 1));

function Admin({ firebase }) {
  const [adminBets, setAdminBets] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [originalBets, setOriginalBets] = React.useState(null);

  const snackbar = useSnackbar();
  const classes = useStyles();
  React.useEffect(() => {
    async function getAdmin() {
      const get = firebase.functions.httpsCallable('admin');
      const res = await get();
      const data = extendBetResult(res);

      setAdminBets(data);
      setOriginalBets(JSON.parse(JSON.stringify(data)));
    }

    getAdmin();
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
      .filter((x) => x.home.result != null && x.away.result != null && !isPristine(x));
    filteredBets.forEach((x) => {
      if (x.home.result < 0 || x.away.result < 0) {
        return alert('Negativt resultat i match');
      }
    });
    if (filteredBets.length == 0) {
      setIsSaving(false);

      return;
    }
    const saveResults = firebase.functions.httpsCallable('saveResults');
    saveResults({ bets: filteredBets })
      .then((res) => {
        console.log(res);
        const data = extendBetResult(res);
        setAdminBets(data);
        snackbar.showMessage('Resultat sparat');
        setIsSaving(false);
      })
      .catch((error) => {
        console.error('onRejected function called: ' + error.message);
        snackbar.showMessage('Misslyckades med att spara');
        setIsSaving(false);
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
    <Grid container direction="column" justify="space-between" alignItems="center">
      {adminBets.length ? (
        <>
          <div className={classes.fabWrapper}>
            <Fab variant="round" color="primary" disabled={isSaving} onClick={() => saveBets()}>
              <SaveIcon />
            </Fab>
            {isSaving && <CircularProgress className={classes.fabProgress} size={68} color={'secondary'} />}
          </div>
          <Grid item xs={12}>
            <Typography variant={'h6'} style={{ marginBottom: '10px' }}>
              Tippa
            </Typography>
          </Grid>

          {adminBets.map((bet, i) => {
            return (
              <Grid item>
                <BetCard bet={bet} key={bet.kickoff + i} onChange={handleOnChange} />
              </Grid>
            );
          })}
        </>
      ) : null}
    </Grid>
  );
}
export default Admin;
