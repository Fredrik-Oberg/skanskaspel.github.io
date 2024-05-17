import React from "react";
import { InputAdornment, makeStyles, TextField } from "@material-ui/core";
import FlagIcon from "../Icons";
import { countryNamesSe } from "../../country-names.se";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "125px",
  },
}));

const ResultInput = ({
  onChangeResult,
  initialValue,
  disabled,
  teamName,
  isHomeTeam,
}) => {
  const [value, setValue] = React.useState(initialValue);
  React.useEffect(() => {
    onChangeResult && onChangeResult(value);
  });
  const classes = useStyles();

  const country = (teamName || "").replace(" ", "_");
  const seName = countryNamesSe[country];
  const inputPosition = isHomeTeam
    ? {
        startAdornment: (
          <InputAdornment position="start">
            <FlagIcon country={country} />
          </InputAdornment>
        ),
      }
    : {
        endAdornment: (
          <InputAdornment position="end">
            <FlagIcon country={country} />
          </InputAdornment>
        ),
      };
  return (
    <TextField
      className={classes.root}
      label={seName}
      variant="outlined"
      value={value}
      placeholder={0}
      disabled={disabled}
      type="number"
      onChange={(event) => setValue(event.target.value)}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputProps: {
          style: !isHomeTeam ? { textAlign: "right" } : {},
          min: 0,
        },
        ...inputPosition,
      }}
    />
  );
};
export default ResultInput;
