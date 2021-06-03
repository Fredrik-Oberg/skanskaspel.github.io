import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
  makeStyles,
} from "@material-ui/core";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";

import Loader from "../Loader";

const useStyles = makeStyles({
  table: {
    minWidth: 470,
  },
});

function Results({ firebase }) {
  const [results, setResults] = React.useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  React.useEffect(() => {
    async function getResults() {
      const get = firebase.functions.httpsCallable("results");
      const res = await get();
      setResults(res.data);

      // // Local json file
      // const storageRef = firebase.storage.ref();
      // // const storage = getStorage();
      // var starsRef = storageRef.child("results");

      // // Get the download URL
      // const res = await starsRef
      //   .getDownloadURL()
      //   .then(async (url) => {
      //     // Insert url into an <img> tag to "download"
      //     const res = await fetch(url, {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Accept: "application/json",
      //       },
      //     }).then(function (response) {
      //       return response.json();
      //     });
      //   })
      //   .catch((error) => {
      //     debugger;
      //     // Handle any errors
      //   });
      // debugger;
      // const res = await getDownloadURL(ref(storage, "bucket/results"))
      //   .then(async (url) => {
      //     // `url` is the download URL for 'images/stars.jpg'

      //     // This can be downloaded directly:
      //     const res = await fetch(url, {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Accept: "application/json",
      //       },
      //     }).then(function (response) {
      //       return response.json();
      //     });
      //   })
      //   .catch((error) => {
      //     debugger;
      //     // Handle any errors
      //   });
      // debugger;
      setResults(res.data);
    }
    getResults();
  }, [firebase.functions]);

  const classes = useStyles();
  const condensedHeader = matches ? "P" : "Poäng";
  return !results ? (
    <Loader />
  ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={1}>#</TableCell>
            <TableCell colSpan={7}>Namn</TableCell>
            <TableCell align="center">Totalt</TableCell>
            <TableCell
              align="center"
              colSpan={1}
            >{`2 ${condensedHeader}`}</TableCell>
            <TableCell
              align="center"
              colSpan={1}
            >{`1 ${condensedHeader}`}</TableCell>
            <TableCell
              align="center"
              colSpan={1}
            >{`0 ${condensedHeader}`}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((row, i) => (
            <TableRow key={row.name}>
              <TableCell colSpan={1}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : (i + 1).toString()}
              </TableCell>
              <TableCell colSpan={7}>{row.name}</TableCell>
              <TableCell align="center" colSpan={1}>
                {row.totalPoints}
              </TableCell>
              <TableCell align="center" colSpan={1}>
                {row.fullPoints}
              </TableCell>
              <TableCell align="center" colSpan={1}>
                {row.correctOutcomes}
              </TableCell>
              <TableCell align="center" colSpan={1}>
                {row.wrongOutcomes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default Results;
