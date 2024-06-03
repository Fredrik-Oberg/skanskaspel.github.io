import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import CurrentBetsCard from './current-bets-card';
import Loader from '../Loader';

function CurrentBets({ firebase }) {
  const [currentBets, setCurrentBets] = React.useState(null);
  const [pastBets, setPastBets] = React.useState([]);
  const [loadingPast, setLoadingPast] = React.useState(false);

  React.useEffect(() => {
    async function getCurrentBets() {
      const get = firebase.functions.httpsCallable('currentBets');
      const res = await get({ onlyCurrent: true });
      setCurrentBets(res.data);
    }
    getCurrentBets();
  }, [firebase.functions]);

  const fetchPastBets = React.useCallback(async () => {
    setLoadingPast(true);
    const get = firebase.functions.httpsCallable('currentBets');
    const res = await get({ onlyCurrent: false });
    setPastBets(res.data);
    setLoadingPast(false);
  }, [firebase.functions, setLoadingPast]);
  return (
    <Grid item>
      {currentBets == null ? (
        <Loader />
      ) : (
        <>
          {currentBets.length ? (
            <>
              <Typography variant={'h5'} style={{ marginBottom: '15px', textAlign: 'center' }}>
                {'Pågående matcher'}
              </Typography>
              {currentBets
                .sort((a, b) => (a.kickoff > b.kickoff ? -1 : 1))
                .map((bets, i) => (
                  <CurrentBetsCard key={bets.kickoff + i} bets={bets} />
                ))}
            </>
          ) : (
            <Typography variant={'h5'} style={{ marginBottom: '15px', textAlign: 'center' }}>
              {'Inga pågående matcher'}
            </Typography>
          )}
          <Box mt={'25px'} mb={'15px'} textAlign="center">
            {pastBets.length === 0 ? (
              <Button variant="contained" color="secondary" onClick={fetchPastBets} disabled={loadingPast}>
                {'Ladda färdigspelade matcher'}
              </Button>
            ) : (
              <></>
            )}
          </Box>
          {pastBets && pastBets.length ? (
            <>
              <Typography variant={'h5'} style={{ marginBottom: '15px', textAlign: 'center' }}>
                {'Färdigspelade matcher'}
              </Typography>
              {pastBets
                .sort((a, b) => (a.kickoff > b.kickoff ? -1 : 1))
                .map((bets, i) => (
                  <CurrentBetsCard key={bets.kickoff + i} bets={bets} />
                ))}
            </>
          ) : null}
        </>
      )}
    </Grid>
  );
}
export default CurrentBets;
