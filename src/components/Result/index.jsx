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
                {i === 0 ? "🥇" : i === 1 ? "🥈" : ""}
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
