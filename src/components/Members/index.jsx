import React from 'react';
import moment from 'moment';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ListItem,
  ListItemText,
  ListItemAvatar,
  List,
  Paper,
  Collapse,
  Box,
  Typography,
  CardHeader,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../Loader';
import { getCountryName } from '../../country-names.se';
import UserAvatar from '../UserAvatar';

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

function Members({ firebase }) {
  const [users, setUsers] = React.useState(null);

  React.useEffect(() => {
    async function getUsers() {
      const get = firebase.functions.httpsCallable('listUsers');
      const res = await get();
      setUsers(res.data);
    }
    getUsers();
  }, [firebase.functions]);

  return !users ? (
    <Loader />
  ) : (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {users.map((row, i) => {
        const { displayName, photoURL } = row;
        return (
          <>
            <ListItem key={displayName}>
              <ListItemAvatar>
                <UserAvatar size="large" displayName={displayName} url={photoURL} />
              </ListItemAvatar>
              <ListItemText sx={{ marginLeft: '2rem' }} primary={displayName} />
            </ListItem>
          </>
        );
      })}
    </List>
  );
}
export default Members;

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
              <Typography variant="h6" style={{ fontSize: '0.875rem' }} gutterBottom component="div">
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
                        {/* <FlagIcon country={getCountry(historyRow.teams.home)} small /> */}
                        <Typography variant="body2" style={{ fontSize: '8px' }} display="block">
                          {getCountryName(historyRow.teams.home)}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: '8px' }} display="block">
                          {/* {'VS'} */}
                          {'-'}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: '8px' }} display="block">
                          {/* <FlagIcon country={getCountry(historyRow.teams.away)} small /> */}
                          {getCountryName(historyRow.teams.away)}
                        </Typography>
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
              <Typography variant="h6" gutterBottom component="div" style={{ marginTop: '10px', fontSize: '0.875rem' }}>
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
