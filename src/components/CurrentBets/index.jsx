import React from "react";
import { Grid } from "@material-ui/core";
import moment from "../moment";
import CurrentBetsCard from "./current-bets-card";
import Loader from "../Loader";

function CurrentBets({ firebase }) {
  const [currentBets, setCurrentBets] = React.useState(null);

  React.useEffect(() => {
    async function getCurrentBets() {
      const get = firebase.functions.httpsCallable("currentBets");
      const res = await get();
      setCurrentBets(res.data);

      // Local json file
      // const res = await fetch("json-assets/user-bets.json", {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      // }).then(function (response) {
      //   return response.json();
      // });
      // setCurrentBets(res.result);
    }
    getCurrentBets();
  }, [firebase.functions]);

  return (
    <Grid item>
      {currentBets == null ? (
        <Loader />
      ) : currentBets.length ? (
        currentBets
          .sort((a, b) => (a.kickoff > b.kickoff ? -1 : 1))
          .map((bets, i) => (
            <CurrentBetsCard key={bets.kickoff + i} bets={bets} />
          ))
      ) : (
        <h3>Inga pågående matcher</h3>
      )}
    </Grid>
  );
}
export default CurrentBets;
