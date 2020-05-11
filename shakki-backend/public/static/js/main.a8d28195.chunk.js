(this["webpackJsonpshakki-frontend"]=this["webpackJsonpshakki-frontend"]||[]).push([[0],{132:function(e,t,a){e.exports=a(153)},153:function(e,t,a){"use strict";a.r(t);var n=a(52),r=a(0),o=a.n(r),l=a(18),i=a.n(l),c=a(42),u=a(20),s=a(56),d=a(107),m=a(109),g=a(110),f=a(111),b=a(46),p=a(24);function v(){var e=Object(b.a)(["\n  mutation promote($gameId: String!, $pieceType: String!) {\n    promote(\n      gameId: $gameId,\n      pieceType: $pieceType\n    ) {\n      board {\n        type\n        side\n      }\n      id\n      currentPlayer\n      whitePlayer\n      blackPlayer\n      winner\n      gameOver\n      promotionPlayerID\n    }\n  }\n"]);return v=function(){return e},e}function E(){var e=Object(b.a)(["\n  mutation joinGame($gameId: String!) {\n    joinGame(\n      gameId: $gameId\n    ) {\n      board {\n        type\n        side\n      }\n      id\n      currentPlayer\n      whitePlayer\n      blackPlayer\n      winner\n      gameOver\n      promotionPlayerID\n    }\n  }\n"]);return E=function(){return e},e}function h(){var e=Object(b.a)(["\n  mutation createGame {\n    createGame {\n      board {\n        type\n        side\n      }\n      id\n    }\n  }\n"]);return h=function(){return e},e}function j(){var e=Object(b.a)(["\n  mutation addUser($user: NewUserInput!) {\n    addUser(\n      user: $user\n    ) {\n      username\n      tag\n      id\n      friends {\n        tag\n      }\n    }\n  }\n"]);return j=function(){return e},e}function y(){var e=Object(b.a)(["\n  mutation login($username: String!, $password: String!) {\n    login(\n      username: $username,\n      password: $password\n    ) {\n      username\n      tag\n      friends {\n        tag\n      }\n      token\n      id\n    }\n  }\n"]);return y=function(){return e},e}function k(){var e=Object(b.a)(["\n  subscription moveMade($gameId: String!) {\n    moveMade(\n      gameId: $gameId\n    ) {\n      board {\n        type\n        side\n      }\n      id\n      lastMove {\n        success\n      }\n      currentPlayer\n      whitePlayer\n      blackPlayer\n      winner\n      gameOver\n      promotionPlayerID\n    }\n  }\n"]);return k=function(){return e},e}function O(){var e=Object(b.a)(["\n  mutation makeMove($move: MoveInput!) {\n    makeMove(\n      move: $move\n    ) {\n      lastMove {\n        success\n        message\n      }\n    }\n  }\n"]);return O=function(){return e},e}function w(){var e=Object(b.a)(["\n  query getLoggedUser($token: String) {\n    getLoggedUser(\n      token: $token\n    ) {\n      username\n      tag\n      friends {\n        tag\n      }\n      id\n      token\n      guest\n    }\n  }\n"]);return w=function(){return e},e}function C(){var e=Object(b.a)(["\n  query getGame($gameId: String!) {\n    getGame(\n      gameId: $gameId\n    ) {\n      board {\n        type\n        side\n      }\n      id\n      currentPlayer\n      whitePlayer\n      blackPlayer\n      winner\n      gameOver\n      promotionPlayerID\n    }\n  }\n"]);return C=function(){return e},e}var I,S=Object(p.a)(C()),P=Object(p.a)(w()),L=Object(p.a)(O()),D=Object(p.a)(k()),N=Object(p.a)(y()),$=Object(p.a)(j()),q=Object(p.a)(h()),x=Object(p.a)(E()),M=Object(p.a)(v()),G=a(99),T=a.n(G),U=a(114),Q={width:45,height:45,display:"table-cell",verticalAlign:"middle"},K=function(e){var t=e.style,a=e.children,n=e.id,r=e.side;return o.a.createElement("div",{style:t,className:"piece",draggable:"true",onDragStart:function(e){I=e.target,e.target.style.opacity=.5},onDragEnd:function(e){e.target.style.opacity=1},type:n,side:r,id:n},a)},A=function(e){var t=e.side,a=e.id,r=Object(n.a)({},Q);return r.backgroundColor="black"===t?"#000000":"#ffffff",r.color="white"===t?"#000000":"#ffffff",o.a.createElement(K,{style:r,id:a,side:t},"K")},J=function(e){var t=e.side,a=e.id,r=Object(n.a)({},Q);return r.backgroundColor="black"===t?"#000000":"#ffffff",r.color="white"===t?"#000000":"#ffffff",o.a.createElement(K,{style:r,id:a,side:t},"D")},B=function(e){var t=e.side,a=e.id,r=Object(n.a)({},Q);return r.backgroundColor="black"===t?"#000000":"#ffffff",r.color="white"===t?"#000000":"#ffffff",o.a.createElement(K,{style:r,id:a,side:t},"T")},H=function(e){var t=e.side,a=e.id,r=Object(n.a)({},Q);return r.backgroundColor="black"===t?"#000000":"#ffffff",r.color="white"===t?"#000000":"#ffffff",o.a.createElement(K,{style:r,id:a,side:t},"R")},R=function(e){var t=e.side,a=e.id,r=Object(n.a)({},Q);return r.backgroundColor="black"===t?"#000000":"#ffffff",r.color="white"===t?"#000000":"#ffffff",o.a.createElement(K,{style:r,id:a,side:t},"L")},V=function(e){var t=e.side,a=e.id,r=Object(n.a)({},Q);return r.backgroundColor="black"===t?"#000000":"#ffffff",r.color="white"===t?"#000000":"#ffffff",o.a.createElement(K,{style:r,id:a,side:t},"S")},z=o.a.createContext(null),F=o.a.createContext(null),W=function(e){var t,a=e.color,n=e.makeMove,l=e.location,i=e.piece,c=e.dragHelperMap,u=Object(r.useContext)(F).gameId,s={height:70,width:70,backgroundColor:"#1df0c9",textAlign:"center"},d={height:70,width:70,backgroundColor:"#19917b",textAlign:"center"},m=function(){var e=Object(U.a)(T.a.mark((function e(t){var r,o,i,s,d;return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),console.log("dragged:",I),r={type:c.get(Number(I.id)).type,side:c.get(Number(I.id)).side},o={row:Math.floor(Number(I.id)/8),column:Number(I.id)%8},i=l,"square"===t.target.className?t.target.style.backgroundColor="white"===a?"#1df0c9":"#19917b":"piece"===t.target.className&&((s=t.target.parentNode).style.backgroundColor="white"===s.id?"#1df0c9":"#19917b"),e.prev=6,e.next=9,n({variables:{move:{piece:r,oldLocation:o,newLocation:i,gameId:u}}});case 9:(d=e.sent).data.makeMove.lastMove.success||console.log(d.data.makeMove.lastMove.message),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(6),console.log(e.t0.message);case 16:case"end":return e.stop()}}),e,null,[[6,13]])})));return function(t){return e.apply(this,arguments)}}();if(i)switch(i.type){case"pawn":t=o.a.createElement(V,{side:i.side,id:8*l.row+l.column});break;case"rook":t=o.a.createElement(B,{side:i.side,id:8*l.row+l.column});break;case"knight":t=o.a.createElement(H,{side:i.side,id:8*l.row+l.column});break;case"bishop":t=o.a.createElement(R,{side:i.side,id:8*l.row+l.column});break;case"queen":t=o.a.createElement(J,{side:i.side,id:8*l.row+l.column});break;case"king":t=o.a.createElement(A,{side:i.side,id:8*l.row+l.column});break;default:t=null}return o.a.createElement("td",{id:"white"===a?"white":"black",style:"white"===a?s:d,className:"square",onDragLeave:function(e){"square"===e.target.className&&"piece"!==e.relatedTarget.className?"white"===e.target.id?e.target.style.backgroundColor="#1df0c9":e.target.style.backgroundColor="#19917b":"piece"===e.target.className&&"square"!==e.relatedTarget.className&&("white"===e.target.parentNode.id?e.target.parentNode.style.backgroundColor="#1df0c9":e.target.parentNode.style.backgroundColor="#19917b")},onDragOver:function(e){e.preventDefault()},onDrop:m,onDragEnter:function(e){"square"===e.target.className?e.target.style.backgroundColor="#11d161":"piece"===e.target.className&&(e.target.parentNode.style.backgroundColor="#11d161")}},t)},X=function(e,t,a){var n=t.readQuery({query:S,variables:{gameId:a}});n={getGame:e.moveMade},console.log("newGameData:",e),t.writeQuery({query:S,data:n,variables:{gameId:a}}),console.log("Game state updated with:",t.readQuery({query:S,variables:{gameId:a}}))},Y=a(182),Z=function(){var e=Object(d.a)(),t=Object(s.g)().id,a=Object(r.useContext)(F).setGameId,n=Object(r.useContext)(z).user,l=Object(m.a)(S,{variables:{gameId:t},onError:function(e){e.graphQLErrors?console.log(e.graphQLErrors[0].message):console.log(e.message)},onCompleted:function(e){a(e.getGame.id)}}),i=Object(g.a)(L),c=Object(u.a)(i,1)[0],b=Object(g.a)(M),p=Object(u.a)(b,1)[0],v=Object(g.a)(x,{variables:{gameId:t},onError:function(e){e.graphQLErrors?console.log(e.graphQLErrors[0].message):console.log(e.message)},onCompleted:function(a){X(a,e,t)}}),E=Object(u.a)(v,1)[0];Object(f.a)(D,{onSubscriptionData:function(a){var n=a.subscriptionData;X(n.data,e,t)},variables:{gameId:t}}),Object(r.useEffect)((function(){E()}),[E]);var h=function(e){p({variables:{gameId:t,pieceType:e}})};if(l.loading)return"loading...";if(!l.data)return l.error.toString();var j=l.data.getGame,y=j.board,k=j.whitePlayer,O=j.currentPlayer,w=j.gameOver,C=j.winner,I=j.promotionPlayerID,P=new Map;y.forEach((function(e,t){e.forEach((function(e,a){P.set(8*t+a,e)}))}));var N=Array.from(Array(8),(function(e,t){for(var a=new Array(8),n=0;n<8;n++)a[n]=(t+n)%2===0?{piece:null,color:"white"}:{piece:null,color:"black"};return a}));return o.a.createElement("div",null,o.a.createElement("div",null,"Olet ",n.id===k?"valkoiset":"mustat",". ",n.id===O?"On sinun vuorosi.":"Odotetaan vastustajan siirtoa."),o.a.createElement("table",null,o.a.createElement("tbody",null,y.map((function(e,t){return o.a.createElement("tr",{key:t},e.map((function(e,a){return o.a.createElement(W,{key:8*t+a,color:N[t][a].color,makeMove:c,location:{row:t,column:a},piece:e,dragHelperMap:P})})))})))),o.a.createElement("div",null,n.id===I?o.a.createElement("div",null,"Valitse nappula, joksi haluat muuttaa sotilaan",o.a.createElement(Y.a,{onClick:function(){return h("queen")}},"Kuningatar"),o.a.createElement(Y.a,{onClick:function(){return h("rook")}},"Torni"),o.a.createElement(Y.a,{onClick:function(){return h("knight")}},"Ratsu"),o.a.createElement(Y.a,{onClick:function(){return h("bishop")}},"L\xe4hetti")):null),o.a.createElement("div",null,w?C===n.id?"Voitit pelin! Onneksi olkoon!":"Ootko paska ku h\xe4visit :D":null))},_=function(){return o.a.createElement("div",null,"Student project for Full Stack open 2020")},ee=a(191),te=function(){var e=Object(r.useState)(""),t=Object(u.a)(e,2),a=t[0],n=t[1],l=Object(r.useState)(""),i=Object(u.a)(l,2),c=i[0],d=i[1],m=Object(r.useContext)(z).setUser,f=Object(s.f)(),b=Object(g.a)(N,{onError:function(e){console.log(e.graphQLErrors[0].message),d("")}}),p=Object(u.a)(b,2),v=p[0],E=p[1];return Object(r.useEffect)((function(){E.data&&(n(""),d(""),console.log(E.data.login.token),window.sessionStorage.setItem("loggedChessUser",E.data.login.token),m(E.data.login),f.push("/"))}),[E.data,m,f]),o.a.createElement("div",null,o.a.createElement("h2",null,"Kirjaudu sis\xe4\xe4n"),o.a.createElement("form",{onSubmit:function(e){e.preventDefault(),v({variables:{username:a,password:c}})}},o.a.createElement("div",null,o.a.createElement(ee.a,{label:"K\xe4ytt\xe4j\xe4nimi",onChange:function(e){n(e.target.value)},name:"username"})),o.a.createElement("div",null,o.a.createElement(ee.a,{label:"Salasana",type:"password",onChange:function(e){d(e.target.value)},name:"password"})),o.a.createElement("div",null,o.a.createElement(Y.a,{variant:"contained",color:"primary",type:"submit"},"Kirjaudu"))),o.a.createElement("div",null,"tai"),o.a.createElement("div",null,o.a.createElement(Y.a,{variant:"contained",color:"primary",onClick:function(){return f.push("/register")}},"Luo uusi k\xe4ytt\xe4j\xe4")))},ae=a(186),ne=a(187),re=a(188),oe=a(156),le=function(){var e=Object(r.useContext)(z).user;return o.a.createElement(ae.a,{position:"static"},o.a.createElement(ne.a,null,o.a.createElement(re.a,{edge:"start",color:"inherit","aria-label":"menu"}),o.a.createElement(Y.a,{color:"inherit",component:c.b,to:"/play"},"Pelaa"),o.a.createElement(Y.a,{color:"inherit",component:c.b,to:"/info"},"Ohjeet"),e?o.a.createElement(oe.a,{variant:"subtitle1",color:"secondary"},'`"`',e.tag,'`"` kirjautunut'):o.a.createElement(Y.a,{color:"inherit",component:c.b,to:"/login"},"Kirjaudu")))},ie=function(){var e=Object(r.useState)(""),t=Object(u.a)(e,2),a=t[0],n=t[1],l=Object(r.useState)(""),i=Object(u.a)(l,2),c=i[0],d=i[1],m=Object(r.useState)(""),f=Object(u.a)(m,2),b=f[0],p=f[1],v=Object(r.useState)(""),E=Object(u.a)(v,2),h=E[0],j=E[1],y=Object(s.f)(),k=Object(g.a)($,{onError:function(e){console.log(e.graphQLErrors[0].message),window.alert(e.graphQLErrors[0].message)}}),O=Object(u.a)(k,2),w=O[0],C=O[1];return Object(r.useEffect)((function(){C.data&&(n(""),d(""),j(""),window.alert("K\xe4ytt\xe4j\xe4 luotu onnistuneesti."),y.push("/"))}),[C.data,y]),o.a.createElement("div",null,o.a.createElement("h2",null,"Luo uusi k\xe4ytt\xe4j\xe4"),o.a.createElement("form",{onSubmit:function(e){e.preventDefault(),w({variables:{user:{username:a,password:c,tag:h}}})}},o.a.createElement("div",null,o.a.createElement(ee.a,{label:"K\xe4ytt\xe4j\xe4nimi",onChange:function(e){n(e.target.value)},error:0!==a.length&&a.length<2,helperText:0!==a.length&&a.length<2?"Liian lyhyt":"K\xe4ytt\xe4j\xe4nimesi ei n\xe4y muille pelaajille.",required:!0})),o.a.createElement("div",null,o.a.createElement(ee.a,{label:"Pelinimi",onChange:function(e){j(e.target.value)},helperText:"Nimi joka n\xe4kyy muille pelaajille.",required:!0})),o.a.createElement("div",null,o.a.createElement(ee.a,{label:"Salasana",type:"password",onChange:function(e){d(e.target.value)},error:c.length<8&&""!==c,helperText:c.length<8&&""!==c?"Liian lyhyt":null,required:!0}),o.a.createElement("div",{style:{paddingTop:20,paddingBottom:10}},o.a.createElement("strong",null,"\xc4l\xe4 k\xe4yt\xe4 samaa salasanaa, joka sinulla on muilla nettisivuilla. "),"Olen vain opiskelija, ja t\xe4m\xe4 on ensimm\xe4inen nettiprojektini, joten en voi taata sivuston tietoturvallisuutta.")),o.a.createElement("div",null,o.a.createElement(ee.a,{label:"Salasana uudelleen",type:"password",onChange:function(e){p(e.target.value)},error:b!==c,helperText:b!==c?"Salasanat eiv\xe4t vastaa toisiaan.":null,required:!0})),o.a.createElement("div",null,o.a.createElement(Y.a,{variant:"contained",color:"primary",type:"submit"},"Luo k\xe4ytt\xe4j\xe4"))))},ce=a(189),ue=function(){var e=Object(r.useState)(null),t=Object(u.a)(e,2),a=t[0],n=t[1],l=Object(r.useContext)(z).user,i=Object(g.a)(q,{onError:function(e){console.log(e.message)}}),c=Object(u.a)(i,2),s=c[0],d=c[1];return Object(r.useEffect)((function(){if(d.data){var e=d.data.createGame.id;n("".concat("http://localhost:4000","/play/").concat(e))}}),[d.data]),o.a.createElement("div",null,o.a.createElement(Y.a,{onClick:function(){l?s():console.log("Sinun t\xe4ytyy kirjautua ennen kuin pelaat")}},"Peli linkin kautta"),a?o.a.createElement("div",null,"Jaa t\xe4m\xe4 linkki kaverillesi. Sen kautta p\xe4\xe4set pelaamaan.","  ",o.a.createElement(ce.a,{href:a},a)):null)},se=function(){var e=Object(r.useState)(null),t=Object(u.a)(e,2),a=t[0],n=t[1],l=Object(r.useState)(null),i=Object(u.a)(l,2),c=i[0],d=i[1],g=Object(m.a)(P,{variables:{token:window.sessionStorage.getItem("loggedChessUser")}});return Object(r.useEffect)((function(){g.data&&(g.data.getLoggedUser.guest?(n(g.data.getLoggedUser),window.sessionStorage.setItem("loggedChessUser",g.data.getLoggedUser.token)):n(g.data.getLoggedUser))}),[g.data]),o.a.createElement("div",null,o.a.createElement(z.Provider,{value:{user:a,setUser:n}},o.a.createElement(le,null),a?o.a.createElement(s.c,null,o.a.createElement(s.a,{path:"/play/:id"},o.a.createElement(F.Provider,{value:{gameId:c,setGameId:d}},o.a.createElement(Z,null))),o.a.createElement(s.a,{path:"/play"},o.a.createElement(F.Provider,{value:{gameId:c,setGameId:d}},o.a.createElement(ue,null))),o.a.createElement(s.a,{path:"/login"},o.a.createElement(te,null)),o.a.createElement(s.a,{path:"/register"},o.a.createElement(ie,null))):"loading",o.a.createElement(_,null)))},de=a(190),me=a(64),ge=a(79),fe=a(80),be=a(81),pe=a(108),ve=a(120),Ee=a(119),he=a(121),je=Object(ve.a)((function(e,t){var a=t.headers,r=sessionStorage.getItem("loggedChessUser");return{headers:Object(n.a)({},a,{authorization:r?"bearer ".concat(r):null})}})),ye=new me.a({uri:"http://localhost:4000/graphql"}),ke=new he.a({uri:"ws://localhost:4000/graphql",options:{reconnect:!0}}),Oe=Object(ge.a)((function(e){var t=e.query,a=Object(Ee.a)(t);return"OperationDefinition"===a.kind&&"subscription"===a.operation}),ke,je.concat(ye)),we=new fe.a({cache:new be.a,link:Oe,connectToDevTools:!0});i.a.render(o.a.createElement(pe.a,{client:we},o.a.createElement(de.a,null,o.a.createElement(c.a,null,o.a.createElement(se,null)))),document.getElementById("root"))}},[[132,1,2]]]);
//# sourceMappingURL=main.a8d28195.chunk.js.map