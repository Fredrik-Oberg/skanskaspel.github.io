import React from "react";

import { Grid, Typography } from "@material-ui/core";

const Bold = ({ text }) => (
  <Typography
    fontWeight="fontWeightBold"
    style={{ fontWeight: "bold", marginBottom: "10px" }}
  >
    {text}
  </Typography>
);
const Text = ({ indent, text }) => (
  <Typography
    style={{ marginLeft: indent ? "20px" : "0px", marginBottom: "15px" }}
  >
    {text}
  </Typography>
);
function Rules() {
  return (
    <Grid item>
      <Bold text="📝 SÅ HÄR TIPPAR DU 📝" />

      <Text text="✅ Fyll i resultaten under fliken ”Tippa”. Du kan fylla i och ändra ditt tipp fram till avspark." />

      <Text text="✅ GLÖM INTE trycka på ”Spara” när du fyllt i. Har du ej fyllt i eller glömt att spara blir det 0 poäng." />

      <Text text="✅ Under ”Pågående matcher” ser du vad alla andra har tippat när matchen börjat spelas." />

      <Text text="✅ Under ”Tabell” kan du se aktuell ställning i tippet." />

      <Text text="✅ När gruppspelet är slut dyker slutspelsmatcherna upp under ”Tippa”." />
      <Text text="⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️" />
      <Bold text="POÄNGRÄKNING 1️⃣❌2️⃣" />
      <Text text="▪️Rätt resultat = 2 poäng." />
      <Text text="▪️Rätt matchvinnare (eller rätt tippat oavgjort) men fel resultat = 1 poäng." />
      <Text text="▪️Fel matchvinnare (eller fel tippat oavgjort) = 0 poäng." />
      <Text text="▪️Det är endast resultatet för ordinarie speltid + tilläggstid som räknas. Alltså ej straffar eller förlängning." />
      <Text text="▪️Om två tippare slutar på samma poäng vinner den som har flest 2-poängare." />
      <Text text="⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️" />
      <Bold text="🏆 VINST OCH BETALNING 🏆" />
      <Text text="Tvåan får tillbaka insatsen." />
      <Text text="Ettan får resten. Summan vet vi först när samtliga deltagare betalt in." />

      <Text text="⏱Din anmälan är godkänd först när du swishat 100 kronor till Fredrik på 0708 93 82 05." />
      <Text text="Pengarna ska vara Fredrik till handa senast 10/6 kl. 23.59, annars får man rött kort och åker ut gruppen." />

      <Text text='❌ Systemet är platsbyggt för ett antal noga utvalda spelare, så det finns tyvärr inget utrymme för "kan min kompis få vara med?".' />
      <Text text="⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️⚽️" />
      <Bold text="🎲 HAR DU PROBLEM MED SPELANDET? 🎲" />
      <Text text="Gå in på stödlinjen.se eller spela mer för att vinna tillbaka det du förlorat. 💰" />

      <Text text="Och du, lycka till!" />

      <Text text="🔴🟡 Skånska Spel 🟡🔴" />
      <br />
      <br />
    </Grid>
  );
}
export default Rules;
