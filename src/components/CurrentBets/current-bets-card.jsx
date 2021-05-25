import React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import moment from "../moment";
import FlagIcon from "../Icons";
import { countryNamesSe } from "../../country-names.se";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "375px",
    marginBottom: "15px",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      minWidth: "275px",
    },
  },
  cardHeaderDateTimeGridItem: {
    alignSelf: "flex-end",
  },
  table: {
    width: "320px",
  },
  tableBodyRowCell: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.7rem",
    },
  },
}));

const Country = ({ teamName }) => {
  const country = (teamName || "").replace(" ", "_");
  const seName = countryNamesSe[country];
  return (
    <>
      <Typography>{seName}</Typography>
      <FlagIcon country={country}></FlagIcon>
    </>
  );
};

function CurrentBetsCard({ bets }) {
  const kickoff = moment(bets.kickoff);
  const classes = useStyles();
  bets.usersBet.sort((a, b) => {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  });
  return (
    <Card variant="outlined" className={classes.root}>
      <CardContent>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Country teamName={bets.homeTeam} />
          </Grid>
          <Grid item>
            <Box mt={"15px"}>
              <Typography variant="body1" component="div">
                {bets.homeResult !== null && bets.awayResult !== null
                  ? `${bets.homeResult} - ${bets.awayResult}`
                  : "Pågår"}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Country teamName={bets.awayTeam} />
          </Grid>
          <Grid item className={classes.cardHeaderDateTimeGridItem}>
            <Typography variant="body1" component="div">
              <span>{`${kickoff.format("dddd DD/MM")}`}</span>
            </Typography>
            <Typography variant="body1" component="div" align="center">
              <span>{`${kickoff.format("HH:mm")}`}</span>
            </Typography>
          </Grid>
        </Grid>
        <CardActions>
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            style={{
              marginTop: "10px",
            }}
          >
            <Grid
              item
              justify="space-between"
              key={"header"}
              style={{
                paddingTop: "0px",
              }}
            >
              <TableContainer>
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Namn</TableCell>
                      <TableCell>Tipp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bets.usersBet.map((userBet) => (
                      <TableRow key={userBet.name}>
                        <TableCell
                          component="th"
                          className={classes.tableBodyRowCell}
                        >
                          {userBet.name}
                        </TableCell>
                        <TableCell
                          component="th"
                          className={classes.tableBodyRowCell}
                        >
                          {userBet.homeResult} - {userBet.awayResult}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default CurrentBetsCard;
