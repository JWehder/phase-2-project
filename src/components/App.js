import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home"
import MyTeam from "./MyTeam"
import Login from "./Login"
import Header from "./Header"
import SavedTeams from "./SavedTeams"


function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [savedTeams, setSavedTeams] = useState([])
  const [header, setHeader] = useState("")
  const [allPlayers, setAllPlayers] = useState([])
  const [myTeam, setMyTeam] = useState({
    QB: {},
    RB: {},
    WR: {},
    TE: {},
    K: {},
    DEF: {},
  })

  const [teamData, setTeamData] = useState({
    cityName: "",
    teamName: "",
    teamLogo: ""
  })

  const [editMode, setEditMode] = useState(true)

  useEffect(() => {
      fetch('http://localhost:3000/players')
      .then(resp => resp.json())
      .then((players) => setAllPlayers(players))
  }, []); 

  function handlePlayerClick(playerName) {
    fetch('http://localhost:3000/players') 
      .then(resp => resp.json())
      .then((players) => {
        const pickedPlayer = players.filter((player) => player.name === playerName)
        let playerObject = pickedPlayer[0]
        setMyTeam({
          ...myTeam,
          [playerObject.position]: {...playerObject}
        })
      })
  }

  function handleSaveTeam() {
    const teamAndCity = `${teamData.cityName}, ${teamData.teamName}`

    const personalTeamData = {
      [teamAndCity]: {
        cityName: teamData.cityName,
        teamName: teamData.teamName,
        teamLogo: teamData.teamLogo
      },
      myPlayers: [myTeam.QB, myTeam.RB, myTeam.WR, myTeam.TE, myTeam.K, myTeam.DEF]
    }
    fetch('http://localhost:3000/teams', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personalTeamData),
    })
      .then(res => res.json())
      .then((teams) => teams.map((teamObj) => {
        const teamKeys = Object.keys(teamObj)
        let teamName = teamKeys[0]
        setSavedTeams([
            ...savedTeams,
            {
                id: teamObj.id,
                myPlayers: teamObj["myPlayers"],
                teamName: teamName
            }
        ])
        setMyTeam({
          QB: {},
          RB: {},
          WR: {},
          TE: {},
          K: {},
          DEF: {},
        })
        setTeamData({
          cityName: "",
          teamName: "",
          teamLogo: ""
        })
    }))
  }

  function handleClick() {
    setIsLoggedIn(false)
  }

  function handleEditClick() {
    setEditMode(!editMode)
  }


  return (
      <div>
        <Header />
        <NavBar 
        isLoggedIn={loggedIn}
        handleClick={handleClick}
        />
        <Switch>
          <Route path="/myteam">
            <MyTeam 
            onSaveTeam={handleSaveTeam}
            isLoggedIn= {loggedIn} 
            team= {teamData}
            myTeam= {myTeam}
            setTeamData= {setTeamData}
            editMode= {editMode}
            onEditClick= {handleEditClick}
            />
          </Route>
          <Route path="/login">
            <Login 
            setIsLoggedIn= {setIsLoggedIn} 
            setHeader={setHeader}
            />
          </Route>
          <Route path="/mysavedteams">
            <SavedTeams
            isLoggedIn={loggedIn} 
            team={teamData}
            setTeam={setTeamData}
            savedTeams={savedTeams}
            />
          </Route>
          <Route exact path="/">
            <Home 
            isLoggedIn= {loggedIn} 
            header={header}
            players={allPlayers}
            onPlayerClick={handlePlayerClick}
            />
          </Route>
          
        </Switch>

      </div>
  );
}

export default App;
