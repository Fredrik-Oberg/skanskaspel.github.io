import React from "react";
import moment from "moment";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import FlagIcon from "../Icons";
import { countryNamesSe } from "../../country-names.se";

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
  return (
    <Card
      variant="outlined"
      style={{
        marginBottom: "15px",
        width: "500px",
      }}
    >
      <CardContent>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="body1" component="div">
              <span>{kickoff.format("dddd MM/DD")}</span>
            </Typography>
          </Grid>
          <Grid item>
            <CardActions>
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
                  <Typography variant="body1" component="div">
                    <span>{kickoff.format("HH:mm")}</span>
                  </Typography>
                </Grid>
                <Grid item>
                  <Country teamName={bets.awayTeam} />
                </Grid>
              </Grid>
            </CardActions>
          </Grid>

          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            spacing={2}
            style={{
              marginTop: "10px",
            }}
          >
            {bets.usersBet.map((userBet, i) => (
              <Grid
                item
                key={userBet.name}
                style={{
                  paddingTop: "0px",
                }}
              >
                <Typography variant="body1">
                  {userBet.name}:&nbsp;
                  <Typography component="span">
                    {userBet.homeResult} - {userBet.awayResult}
                  </Typography>
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CurrentBetsCard;
