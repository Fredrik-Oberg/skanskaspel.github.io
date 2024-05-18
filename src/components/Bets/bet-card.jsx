import React from 'react';
import { Card, CardContent, Box, Grid, Typography, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import moment from '../moment';
import ResultInput from './result-input';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    marginBottom: '10px',
  },
  cardContentRoot: {
    '&:last-child': {
      paddingBottom: '16px',
    },
  },
  cardActionsRoot: {
    paddingTop: '12px',
  },
  cardContentItem: {
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
    width: '62%',
  },
  resultInputXs: {
    [theme.breakpoints.down('xs')]: {
      padding: '0px!important',
    },
  },
  kickoff: {
    textTransform: 'capitalize',
  },
}));

function BetCard({ bet, onChange, disableIfStarted }) {
  const kickoff = moment(bet.kickoff);
  const started = moment().isAfter(kickoff);
  const classes = useStyles();
  const disabled = started && disableIfStarted;
  return (
    <Card
      variant="outlined"
      style={{
        backgroundColor: bet.isFinished ? 'rgb(241 241 241)' : 'white',
      }}
      className={classes.card}
    >
      {/* {!bet.hasResult && (
        <CardContent  marginBottom={2}>
          <Box width={'100%'} textAlign="center">
            <Chip
              label="Tips saknas"
              color="primary"
              style={{
                color: '#000',
                backgroundColor: '#FCBF49',
              }}
            />
          </Box>
        </CardContent>
      )} */}
      <CardContent className={classes.cardContentRoot}>
        <Grid container direction="row" justifyContent="space-between" alignItems="baseline">
          <Grid item>
            <Typography variant="body1" component="div">
              <span className={classes.kickoff}>{kickoff.format('dddd DD/MM')}</span>
            </Typography>
          </Grid>
          <Grid item>
          {!bet.hasResult && (<Chip 
              label="Tips saknas"
              color="primary"
              style={{
                color: '#000',
                backgroundColor: '#FCBF49',
              }}
            />)}
            {/* <Typography color="textSecondary" display={'inline'}>
              <span>{translateGroup(bet)}</span>
            </Typography> */}
        
          </Grid>
        </Grid>
      </CardContent>
      <CardContent className={classes.cardActionsRoot}>
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={2}>
          <Grid item xs={5} className={classes.resultInputXs}>
            <ResultInput
              teamName={bet.home.team}
              onChangeResult={(val) => {
                bet.home.result = val;
                onChange(bet);
              }}
              initialValue={bet.home.result}
              disabled={disabled}
              isHomeTeam
            />
          </Grid>
          <Grid item xs={2} className={classes.resultInputXs}>
            <Typography variant="body1" component="div" align={'center'}>
              <span>{kickoff.format('HH:mm')}</span>
            </Typography>
          </Grid>
          <Grid item xs={5} className={classes.resultInputXs}>
            <ResultInput
              teamName={bet.away.team}
              onChangeResult={(val) => {
                bet.away.result = val;
                onChange(bet);
              }}
              initialValue={bet.away.result}
              disabled={disabled}
              isHomeTeam={false}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  function translateGroup(bet) {
    if (bet.group) {
      return bet.group.replace('Group', 'Grupp');
    }
    if (!bet.stage) {
      return '-';
    }
    const trimmed = bet.stage.trim();
    switch (trimmed) {
      case 'LAST_16':
        return 'Åttondelsfinal';
      case 'QUARTER_FINAL':
        return 'Kvartsfinal';
      case 'SEMI_FINAL':
        return 'Semifinal';
      case 'FINAL':
        return 'Final';
      default:
        return '';
    }
  }
}

export default BetCard;
