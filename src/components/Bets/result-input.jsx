import React from "react";
import { InputAdornment, makeStyles, TextField } from "@material-ui/core";
import FlagIcon from "../Icons";
import { countryNamesSe } from "../../country-names.se";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "125px",
  },
}));

const ResultInput = ({ onChangeResult, initialValue, disabled, teamName }) => {
  const [value, setValue] = React.useState(initialValue);
  React.useEffect(() => {
    onChangeResult && onChangeResult(value);
  });
  const classes = useStyles();

  const country = (teamName || "").replace(" ", "_");
  const seName = countryNamesSe[country];
  return (
    <TextField
      className={classes.root}
      id="outlined-basic"
      label={seName}
      variant="outlined"
      value={value != null ? value : 0}
      disabled={disabled}
      type="number"
      min={0}
      onChange={(event) => setValue(event.target.value)}
      InputProps={{
        inputProps: {
          min: 0,
        },
        startAdornment: (
          <InputAdornment position="start">
            <FlagIcon country={country} />
          </InputAdornment>
        ),
      }}
    />
  );
};
export default ResultInput;
