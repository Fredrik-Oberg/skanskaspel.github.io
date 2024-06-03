import React from 'react';
import { Avatar } from '@mui/material';

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
  let na = '';
  const n = name.split(' ');
  if (n.length >= 2) {
    na = n[0][0] + n[1][0];
  } else if (n.length === 1) {
    na = n[0][0];
  } else {
    return '';
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: na,
  };
}
function UserAvatar({ url, displayName, size }) {
  let avtarSize = {
    width: 24,
    height: 24,
    fontSize: '0.75rem',
  };

  if (size === 'large') {
    avtarSize.width = 86;
    avtarSize.height = 86;
    avtarSize.fontSize = '2.25rem';
  }
  if (!url) {
    const props = stringAvatar(displayName || '');
    props.sx = {
      ...props.sx,
      ...avtarSize,
    };
    return (
      <>
        <Avatar {...props}></Avatar>
      </>
    );
  }
  return (
    <>
      <Avatar sx={{ ...avtarSize }} src={url}></Avatar>
    </>
  );
}
export default UserAvatar;
