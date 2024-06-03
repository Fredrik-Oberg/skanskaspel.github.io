import React from 'react';
import { Visibility, VisibilityOff, Save as SaveIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UserAvatar from '../UserAvatar';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
function UserProfile({ firebase }) {
  var user = firebase.auth.currentUser;
  const [password, setPassword] = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [avatarUrl, setAvtarUrl] = React.useState(user.photoURL);
  const [displayName, setDisplayName] = React.useState(user.displayName);
  console.log(user);

  React.useEffect(() => {
    async function getUser(uid) {
      const get = firebase.functions.httpsCallable('listUsers');
      const res = await get({ uid: uid });
      console.log(res);
    }
    getUser(user.uid);
  }, [firebase.functions, user.uid]);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const updatePwd = (event) => {
    if (password && password.trim() !== '') {
      updatePassword(password.trim());
    }
  };
  const updateName = (event) => {
    if (displayName && displayName.trim() !== '') {
      if (displayName !== user.displayName) {
        updateDisplayName(displayName.trim());
      }
    }
  };
  const updateDisplayName = (displayName) => {
    user
      .updateProfile({
        displayName,
      })
      .then(function (e) {
        console.log(e);
        // Update successful.
      })
      .catch(function (error) {
        // An error happened.
      });
  };
  const updatePassword = (newPassword) => {
    user
      .updatePassword(newPassword)
      .then((e) => {
        firebase.auth.signOut().then(() => (document.location.href = '/'));
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          setPasswordError(true);
        }
        // An error happened.
      });
  };
  const loadImg = (event) => {
    const file = event.target.files[0];
    // Create a root reference
    const storageRef = firebase.storage.ref();

    // Create file metadata including the content type
    var metadata = {
      contentType: file.type,
    };
    const imgName = `${user.uid}/avatar`;
    var ref = storageRef.child(imgName);
    ref
      .put(file, metadata)
      .then((res) => {
        console.log('Uploaded');
        ref.getDownloadURL().then((downloadUrl) => {
          user.updateProfile({
            photoURL: downloadUrl,
          });
          setAvtarUrl(downloadUrl);
        });
      })
      .catch((ex) => {
        console.error(ex);
      });
  };
  return (
    <>
      <Grid item>
        <h3>{displayName}</h3>
      </Grid>

      <Grid item>
        <FormControl>
          <TextField
            id="outlined-basic-display-name"
            label={'Namn'}
            variant="outlined"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <Button
            type={'submit'}
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: '15px', marginBottom: '15px' }}
            startIcon={<SaveIcon />}
            onClick={updateName}
          >
            Uppdatera Namn
          </Button>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ alignItems: 'center', my: 2 }}>
          <Stack direction="row" spacing={2}>
            <UserAvatar size={'large'} url={avatarUrl} displayName={displayName} />
          </Stack>
          <Button
            component="label"
            style={{ marginTop: '15px' }}
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Ladda upp bild
            <VisuallyHiddenInput type="file" onChange={(e) => loadImg(e)} />
          </Button>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl variant="outlined" sx={{ alignItems: 'center', my: 2 }}>
          <InputLabel htmlFor="outlined-adornment-password">Nytt Lösenord</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
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
            type={'submit'}
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: '15px' }}
            startIcon={<SaveIcon />}
            onClick={updatePwd}
          >
            Uppdatera lösenord
          </Button>
        </FormControl>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          sx={{ my: 2 }}
          onClick={() => firebase.auth.signOut().then(() => (document.location.href = '/'))}
        >
          {'Logga ut'}
        </Button>
      </Grid>
    </>
  );
}
export default UserProfile;
