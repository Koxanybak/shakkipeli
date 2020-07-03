# shakkipeli
Fullstackopen 2020 harjoitustyö

Työaikakirjaus: https://docs.google.com/spreadsheets/d/1Xoqlym1Z9twADQsRbSQYkNGetG32rLCuKSkfw2rWBMs/edit?usp=sharing

Sivu on käynnisssä osoitteessa https://maailman-paras-shakkipeli.herokuapp.com/

OHJEET:

- Shakkia pääsee pelaamaan klikaamalla "pelaa" -nappia ja sitten klikaamalla "peli linkin kautta" ja klikaamalla sen antamaa linkkiä. Linkki (tai sen viemän osoite) pitää jakaa kaverille, ja sitten voitte pelata.
(HUOM. Shakkia ei voi pelata yksin, tosin linkin voi avata toiselle välilehdelle ja siten voi pelata yksin)

- Toinen tapa päästä peliin on luoda käyttäjä ja kirjautua sisään. Sen jälkeen voit lähettää kaveripyynnöön toiselle käyttäjälle ja kutsua tämän peliin profiilivalikosta.
(HUOM. Kaverilista ei näytä, ovatko kaverit paikalla nettisivulla vai eivät, ja pelikutsua ei saavu perille heidän ollessa poissa. Kaveripyyntö saapuu perille, vaikka he olisivatkin "offline")
(HUOM. Kirjautuessa jos jätät "muista minut" ruksitetuksi, olet kirjautuneena kaikilla välilehdillä, etkä voi pelata silloin voi itseäsi vastaan kahdella välilehdellä)

- Shakin pitäisi noudattaa kaikkia shakin sääntöjä lukuunottamatta sitä, että vuoron voi halutessa ohittaa, jos ei ole shakkitilannetta. Tämä on pelissä siksi, että normaliisti tilanteessa, jossa pelaaja ei voi liikuttaa mitään nappulaa, mutta kuningas ei kuitenkaan ole uhattuna, peli päättyy tasapeliin. Itse en jaksanut toteuttaa algoritmia, joka tämän tarkastaisi (tai muuta tasapelin vaativaa toiminnallisuutta), joten tein napin, jotta peli pääsee etenemään tällaisissa tilanteissa.

- Jos ilmenee ongelmia esim. nappulat eivät liiku tai muuta, niin sivun uudelleenlataaminen auttaa yleensä. (HUOM. lähetetyt ja vastaanotetut pelikutsut (ei kaveripyynnöt) katoavat tällöin näkyvistä)

- Sivu toimii Chromella ja Firefoxilla. Muista selaimista en ole varma.
- Kännykällä sivu myös toimii, mutta se näyttää hieman hassulta.