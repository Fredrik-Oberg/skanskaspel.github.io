import React from "react";
import {
  Card,
  CardContent,
  Box,
  Grid,
  makeStyles,
  Typography,
  Chip,
} from "@material-ui/core";
import moment from "../moment";
import ResultInput from "./result-input";

const useStyles = makeStyles((theme) => ({
  cardContentRoot: {
    "&:last-child": {
      paddingBottom: "16px",
    },
  },
  cardActionsRoot: {
    paddingTop: "12px",
  },
  cardContentItem: {
    [theme.breakpoints.down("sm")]: {
      width: "50%",
    },
    width: "62%",
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
        marginBottom: "15px",
        backgroundColor: bet.isFinished ? "rgb(241 241 241)" : "initial",
        width: "373px",
      }}
    >
      {!bet.hasResult && (
        <CardContent spacing={4}>
          <Box width={"100%"} textAlign="center">
            <Chip
              label="Tips saknas"
              color="primary"
              style={{
                color: "#000",
                backgroundColor: "#FCBF49",
              }}
            />
          </Box>
        </CardContent>
      )}
      <CardContent className={classes.cardContentRoot}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="baseline"
        >
          <Grid item>
            <Typography variant="body1" component="div">
              <span>{kickoff.format("dddd DD/MM")}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="textSecondary" display={"inline"}>
              {bet.group ? (
                <span>{bet.group.replace("Group", "Grupp")}</span>
              ) : (
                <span>{bet.stage}</span>
              )}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardContent className={classes.cardActionsRoot}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={5}>
            <ResultInput
              teamName={bet.home.team}
              onChangeResult={(val) => {
                bet.home.result = val;
                onChange(bet);
              }}
              initialValue={bet.home.result}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" component="div" align={"center"}>
              <span>{kickoff.format("HH:mm")}</span>
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <ResultInput
              teamName={bet.away.team}
              onChangeResult={(val) => {
                bet.away.result = val;
                onChange(bet);
              }}
              initialValue={bet.away.result}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default BetCard;
