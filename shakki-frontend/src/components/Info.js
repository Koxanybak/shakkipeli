import React from "react"
import { makeStyles, Paper } from "@material-ui/core"
import { WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../utils/constants"

const useStyles = makeStyles({
  turnText: {
    background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
    padding: 10,
    /* textAlign: "center", */
  }
})

const Info = () => {
  const classes = useStyles()
  return (
    <Paper className={classes.turnText}>
      - Shakkia pääsee pelaamaan klikaamalla &rdquo;pelaa&rdquo; -nappia ja sitten klikaamalla &rdquo;peli linkin kautta&rdquo; ja klikaamalla sen antamaa linkkiä.<br></br> Linkki (tai sen viemän osoite) pitää jakaa kaverille, ja sitten voitte pelata.<br></br>
(HUOM. Shakkia ei voi pelata yksin, tosin linkin voi avata toiselle välilehdelle ja siten voi pelata yksin)<br></br><br></br>

- Toinen tapa päästä peliin on luoda käyttäjä ja kirjautua sisään. Sen jälkeen voit lähettää kaveripyynnöön toiselle käyttäjälle ja kutsua tämän peliin profiilivalikosta.<br></br>
(HUOM. Kaverilista ei näytä, ovatko kaverit paikalla nettisivulla vai eivät, ja pelikutsua ei saavu perille heidän ollessa poissa. Kaveripyyntö saapuu perille, vaikka he olisivatkin &rdquo;offline&rdquo;)<br></br>
(HUOM. Kirjautuessa jos jätät &rdquo;muista minut&rdquo; ruksitetuksi, olet kirjautuneena kaikilla välilehdillä, etkä voi pelata silloin voi itseäsi vastaan kahdella välilehdellä)<br></br><br></br>

- Shakin pitäisi noudattaa kaikkia shakin sääntöjä lukuunottamatta sitä, että vuoron voi halutessa ohittaa, jos ei ole shakkitilannetta.
Tämä on pelissä siksi, että normaliisti tilanteessa, jossa pelaaja ei voi liikuttaa mitään nappulaa, mutta kuningas ei kuitenkaan ole uhattuna, peli päättyy tasapeliin.
Itse en jaksanut toteuttaa algoritmia, joka tämän tarkastaisi (tai muuta tasapelin vaativaa toiminnallisuutta), joten tein napin, jotta peli pääsee etenemään tällaisissa tilanteissa.<br></br><br></br>

- Jos ilmenee ongelmia esim. nappulat eivät liiku tai muuta, niin sivun uudelleenlataaminen auttaa yleensä.<br></br>
(HUOM. lähetetyt ja vastaanotetut pelikutsut (ei kaveripyynnöt) katoavat tällöin näkyvistä)<br></br><br></br>

- Sivu toimii Chromella ja Firefoxilla. Muista selaimista en ole varma.<br></br><br></br>
- Kännykällä sivu myös toimii, mutta se näyttää hieman hassulta.
    </Paper>
  )
}

export default Info