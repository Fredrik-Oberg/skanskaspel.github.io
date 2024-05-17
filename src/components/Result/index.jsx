import React from 'react';
import moment from 'moment';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../Loader';
import FlagIcon from '../Icons';

const useStyles = makeStyles({
  table: {
    // minWidth: 470,
    '.MuiTable .MuiTable .MuiTableCell-sizeSmall': {
      padding: '0 0px 0px 11px',
    },
  },
  firstTableRow: {
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: '#3f51b526',
    },
    cursor: 'pointer',
    '& > *': {
      borderBottom: 'unset',
    },
  },
  kickoff: {
    textTransform: 'capitalize',
  },
  smallCell: {
    padding: '6px',
    fontSize: '10px',
  },
});

function Results({ firebase }) {
  const [results, setResults] = React.useState(null);
  const theme = useTheme();

  React.useEffect(() => {
    async function getResults() {
      const get = firebase.functions.httpsCallable('resultsFile');
      const res = await get();
      console.log(res);
      sortOnResThen2p(res);
      setGoldSilver(res);
      setResults(res.data);
    }
    getResults();
  }, [firebase.functions]);

  const classes = useStyles();
  return !results ? (
    <Loader />
  ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={1}>#</TableCell>
            <TableCell colSpan={5}>Namn</TableCell>
            <TableCell align="center">2p</TableCell>
            <TableCell align="center">Totalt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((row, i) => (
            <Row row={row} i={i} key={row.name} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
const getCountry = (teamName) => {
  return (teamName || '').replace(' ', '_');
};
export default Results;

// Sort on points then by 2points
function sortOnResThen2p(res) {
  res.data.sort((a, b) => {
    if (a.totalPoints > b.totalPoints) {
      return -1;
    } else if (a.totalPoints < b.totalPoints) {
      return 1;
    }

    // Else go to the 2nd item
    if (a.fullPoints > b.fullPoints) {
      return -1;
    } else if (a.fullPoints > b.fullPoints) {
      return 1;
    } else {
      // nothing to split them
      return 0;
    }
  });
}

function setGoldSilver(res) {
  for (let i = 0; i < res.data.length; i++) {
    const previous = i >= 0 ? res.data[i - 1] : null;
    const person = res.data[i];
    // Since we have sorted already then first is most points.
    if (previous == null) {
      person.gold = true;
    } else if (
      previous.gold &&
      person.totalPoints === previous.totalPoints &&
      person.fullPoints === previous.fullPoints
    ) {
      person.gold = true;
    }
    // We know that previous was gold and this has not same points
    else if (previous.gold) {
      person.silver = true;
    } else if (
      previous.silver &&
      person.totalPoints === previous.totalPoints &&
      person.fullPoints === previous.fullPoints
    ) {
      person.silver = true;
    }
  }
}

function Row({ row, i }) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  if (row.matches) {
    console.log(row.matches);

    row.matches.sort((a, b) => b.kickoff - a.kickoff);
    console.log(row.matches);
  }
  return (
    <>
      <TableRow selected={open} hover className={classes.firstTableRow} onClick={() => setOpen(!open)}>
        <TableCell colSpan={1}>{row.gold ? '🥇' : row.silver ? '🥈' : (i + 1).toString()}</TableCell>
        <TableCell colSpan={5}>{row.name}</TableCell>
        <TableCell align="center" colSpan={1}>
          {row.fullPoints}
        </TableCell>
        <TableCell align="center" colSpan={1}>
          {row.totalPoints}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={8}
          style={{
            paddingTop: !open ? '0px' : 'initial',
            paddingBottom: !open ? '0px' : 'initial',
            paddingLeft: '2px',
            paddingRight: '2px',
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Historik
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.smallCell}>Match</TableCell>
                    <TableCell className={classes.smallCell}>Avspark</TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      Tipp
                    </TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      Resultat
                    </TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      Poäng
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(row.matches || []).map((historyRow) => (
                    <TableRow key={historyRow.kickoff + historyRow.teams.home}>
                      <TableCell className={classes.smallCell} component="th" scope="row">
                        <FlagIcon country={getCountry(historyRow.teams.home)} small />
                        <Typography variant="body2" style={{ fontSize: '8px' }} display="block">
                          {'VS'}
                        </Typography>
                        <FlagIcon country={getCountry(historyRow.teams.away)} small />
                      </TableCell>
                      <TableCell className={`${classes.smallCell} ${classes.kickoff}`}>
                        <Typography variant="body2" style={{ fontSize: '10px' }} display="block">
                          {`${moment(historyRow.kickoff).format('dddd')}`}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: '10px' }} display="block">
                          {`${moment(historyRow.kickoff).format('DD/MM')}`}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: '10px' }} display="block">
                          {`${moment(historyRow.kickoff).format('HH:mm')}`}
                        </Typography>
                      </TableCell>
                      <TableCell className={classes.smallCell} align="center">
                        {`${historyRow.bet.home} - ${historyRow.bet.away}`}
                      </TableCell>
                      <TableCell className={classes.smallCell} align="center">
                        {`${historyRow.result.home} - ${historyRow.result.away}`}
                      </TableCell>
                      <TableCell className={classes.smallCell} align="center">
                        {historyRow.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom component="div" style={{ marginTop: '10px' }}>
                Sammanfattning
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.smallCell} align="center">
                      {'2 P'}
                    </TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      {'1 P'}
                    </TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      {'0 P'}
                    </TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      Totalt
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.smallCell} align="center">
                      {row.fullPoints}
                    </TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      {row.correctOutcomes}
                    </TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      {row.wrongOutcomes}
                    </TableCell>
                    <TableCell className={classes.smallCell} align="center">
                      {row.totalPoints}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
