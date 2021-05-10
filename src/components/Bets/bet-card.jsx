import React from "react";
// TODO moment locale to sv
import moment from "moment";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
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

function BetCard({ bet, onChange }) {
  const kickoff = moment(bet.kickoff);
  const started = moment().isAfter(kickoff);
  const classes = useStyles();

  return (
    <Card
      variant="outlined"
      style={{
        marginBottom: "15px",
        backgroundColor: bet.isFinished ? "#b9b9b9" : "initial",
        width: "100%",
      }}
    >
      {/* <CardHeader
        disableTypography
        title={
          <>
            <Typography variant="body1" component="span">
              <span>{kickoff.format("dddd MM/DD")}</span>
            </Typography>
            <Typography
              color="textSecondary"
              variant={"alignRight"}
              alignSelf="flex-end"
            >
              <span>{bet.group.replace("Group", "Grupp")}</span>
            </Typography>
          </>
        }
      >
        </CardHeader> */}
      <CardContent className={classes.cardContentRoot}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="baseline"
        >
          <Grid item>
            <Typography variant="body1" component="div">
              <span>{kickoff.format("dddd MM/DD")}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="textSecondary" display={"inline"}>
              <span>{bet.group.replace("Group", "Grupp")}</span>
            </Typography>
          </Grid>
        </Grid>
        <CardActions className={classes.cardActionsRoot}>
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
                disabled={started}
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
                disabled={started}
              />
            </Grid>
          </Grid>
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default BetCard;
