import React from "react";
import {
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
} from "@material-ui/icons/";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";

function UserProfile({ firebase }) {
  var user = firebase.auth.currentUser;
  // const [displayName, setDisplayName] = React.useState(user.displayName);
  const [password, setPassword] = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  console.log(user);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const updateUserInfo = (event) => {
    if (password && password.trim() !== "") {
      updatePassword(password.trim());
    }
    // if (displayName && displayName.trim() !== "") {
    //   updateDisplayName(displayName.trim());
    // }
  };
  // const updateDisplayName = (displayName) => {
  //   user
  //     .updateProfile({
  //       displayName,
  //     })
  //     .then(function (e) {
  //       console.log(e);
  //       // Update successful.
  //     })
  //     .catch(function (error) {
  //       // An error happened.
  //     });
  // };
  const updatePassword = (newPassword) => {
    user
      .updatePassword(newPassword)
      .then((e) => {
        firebase.auth.signOut().then(() => (document.location.href = "/"));
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          setPasswordError(true);
        }
        // An error happened.
      });
  };
  return (
    <>
      <Grid item>
      <h3>{firebase.auth.currentUser.displayName}</h3>
      </Grid >
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginBottom: "30px" }}
          onClick={() =>
            firebase.auth.signOut().then(() => (document.location.href = "/"))
          }
        >
          {"Logga ut"}
        </Button>
      </Grid>
      <Grid item>
        {/* <FormControl>
        <TextField
          id="outlined-basic-display-name"
          label={"Namn"}
          variant="outlined"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </FormControl> */}
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Nytt Lösenord
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError(false);
            }}
            error={passwordError}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={100}
          />
          {passwordError && (
            <FormHelperText id="outlined-password-helper-text">
              Lösenordet bör innehålla minst sex tecken
            </FormHelperText>
          )}
          <Button
            type={"submit"}
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: "15px" }}
            startIcon={<SaveIcon />}
            onClick={updateUserInfo}
          >
            Uppdatera lösenord
          </Button>
        </FormControl>
      </Grid>
    </>
  );
}
export default UserProfile;
