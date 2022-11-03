import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home"
import MyTeam from "./MyTeam"
import Login from "./Login"
import CreateTeam from "./CreateTeam";
import Header from "./Header"

function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [header, setHeader] = useState("")
  const [allPlayers, setAllPlayers] = useState([])

  useEffect(() => {
    fetch('')
      .then(resp => resp.json())
      .then((players) => setAllPlayers(players))
  
    }, []); 

  const [team, setTeamData] = useState({
    cityName: "",
    teamName: "",
    teamLogo: ""
  })
  function handleClick() {
    setIsLoggedIn(false)
  }

  return (
      <div>
        <Header />
        <NavBar 
        isLoggedIn={loggedIn}
        handleClick={handleClick}
        />
        <Switch>
          <Route path="/createteam">
            <CreateTeam 
            isLoggedIn={loggedIn} 
            team={team}
            setTeam={setTeamData}
            />
          </Route>
          <Route path="/myteam">
            <MyTeam 
            isLoggedIn= {loggedIn} 
            team= {team}
            />
          </Route>
          <Route path="/login">
            <Login 
            setIsLoggedIn= {setIsLoggedIn} 
            setHeader={setHeader}
            />
          </Route>
          <Route exact path="/">
            <Home 
            isLoggedIn= {loggedIn} 
            header={header} 
            players= {allPlayers}
            />
          </Route>
        </Switch>

      </div>
  );
}

export default App;
