import React from "react";
import moment from "moment";
import faker from '@faker-js/faker';

import {
  Box,
  Grid,
  makeStyles,
  Typography,
  createStyles,
  Paper,
} from "@material-ui/core";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { MessageLeft, MessageRight } from "./messages";
import { TextInput } from "./text-input";

const useStyles = makeStyles(() => {
  createStyles({
    paper: {
      width: "80vw",
      height: "80vh",
      maxWidth: "500px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )",
    },
  });
});

const hashCode = (s) =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

function TestArea({ firebase }) {
  const classes = useStyles();

  const dummy = React.useRef();
  const messagesRef = firebase.firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "asc").limitToLast(25);
  const [messages] = useCollectionData(query, { idField: "id" });

  const scrollToBottom = () => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const sendMessage = async (value) => {
    const { displayName, uid, photoURL } = firebase.auth.currentUser;

    // faker.locale = "sv";
    // faker.seed(hashCode(uid + moment().format("DD/MM")));

    await messagesRef.add({
      // user: faker.name.findName(),
      user: 'TODO',
      body: value,
      createdAt: moment().toISOString(),
      uid: uid,
    });

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Grid item>
      <Box maxWidth={"700px"} alignSelf={"center"}>
        <div className={classes.container}>
          <Paper className={classes.paper} zDepth={2}>
            <Paper className={classes.messagesBody}>
              <Box margin={"15px"} marginTop={"20px"} textAlign="center">
                <Typography
                  variant={"h5"}
                  // fontWeight="fontWeightBold"
                  style={{ marginBottom: "10px" }}
                >
                  TRASH TALK
                </Typography>
                <Typography
                  variant={"body2"}
                  // fontWeight="fontWeightBold"
                  style={{ marginBottom: "10px" }}
                >
                  {`Vill du sprida falska speltips, prata om varför Paulis knäckte
                  sitt Fifa 07-spel eller bara träffa nya ovänner genom
                  fotbollen?`}
                  <br />
                  {"Välkommen till Skånska Spels anonyma chatt."}
                </Typography>
                <Typography
                  variant={"body1"}
                  style={{ fontStyle: "italic", marginBottom: "10px" }}
                >
                  Lämna aldrig ut dina egna personuppgifter (andras går bra) och
                  träffa aldrig någon som säger att de vill bjuda dig på
                  spettekaka.
                </Typography>
              </Box>
              {messages &&
                messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    auth={firebase.auth}
                  />
                ))}
              <span ref={dummy}></span>
              <TextInput onSubmit={(val) => sendMessage(val)} />
            </Paper>
          </Paper>
        </div>
      </Box>
    </Grid>
  );
}
export default TestArea;

function ChatMessage(props) {
  const { user, body, uid, photoURL, createdAt } = props.message;
  const timestamp = moment(createdAt).format("HH:mm");
  return uid === props.auth.currentUser.uid ? (
    <MessageRight
      message={body}
      timestamp={timestamp}
      displayName={user}
      avatarDisp={false}
    />
  ) : (
    <MessageLeft
      message={body}
      timestamp={timestamp}
      displayName={user}
      avatarDisp={false}
    />
  );

  //   <div
  //     style={{
  //       textAlign: uid === props.auth.currentUser.uid ? "right" : "left",
  //     }}
  //     className={`block w-80 break-words p-2 rounded-md ${messageBodyClass}`}
  //   >
  //     <p className="text-xs">{user}</p>
  //     <p>{body}</p>
  // </div>
}
