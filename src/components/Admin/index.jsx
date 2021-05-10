import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loader from "../Loader";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function Admin({ firebase }) {
  const [adminResults, setAdminResults] = React.useState(null);

  React.useEffect(() => {
    async function getAdmin() {
      const get = firebase.functions.httpsCallable("admin");
      debugger;
      const res = await get();
      setAdminResults(res.data);
    }
    getAdmin();
  }, [firebase.functions]);

  const classes = useStyles();

  return !adminResults ? (
    <Loader />
  ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Namn</TableCell>
            <TableCell align="right">Totalt</TableCell>
            <TableCell align="right">2 Poäng</TableCell>
            <TableCell align="right">1 Poäng</TableCell>
            <TableCell align="right">0 Poäng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adminResults.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.totalPoints}</TableCell>
              <TableCell align="right">{row.fullPoints}</TableCell>
              <TableCell align="right">{row.correctOutcomes}</TableCell>
              <TableCell align="right">{row.wrongOutcomes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default Admin;
