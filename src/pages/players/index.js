// ** React Imports
import { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

// ** MUI Imports
import axios from 'axios'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'

const Teams = () => {
  // ** State
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [currentTeam, setCurrentTeam] = useState('')
  const [search, setSearch] = useState('')

  const getUsers = () => {
    axios
      .get(`${process.env.API_BASE_URL}/api/v1/user`)
      .then(res => {
        if (res.data?.data && res.data?.data.length) {
          setPlayers(res.data?.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getUsers()
    axios
      .get(`${process.env.API_BASE_URL}/api/v1/team`)
      .then(res => {
        if (res.data?.data && res.data?.data.length) {
          setTeams(res.data?.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleChange = event => {
    setCurrentTeam(event.target.value)
  }

  let filterData =
    players
      .filter(el => {
        if (el.name) {
          let name = `${el.name}`.toLowerCase()

          return name.includes(search.toLowerCase())
        }
      })
      .filter(el => el?.team?._id == currentTeam || currentTeam == '')
      .sort((a, b) => {
        if (a.type == 'Owner' && b.type != 'Owner') {
          return -1 // Player a is an owner but player b is not, so a comes first
        } else if (a.type != 'Owner' && b.type == 'Owner') {
          return 1 // Player b is an owner but player a is not, so b comes first
        }
        if (a.type == 'Captain' && b.type != 'Captain') {
          return -1 // Player a is an owner but player b is not, so a comes first
        } else if (a.type != 'Captain' && b.type == 'Captain') {
          return 1 // Player b is an owner but player a is not, so b comes first
        } else if (a.team && !b.team) {
          return -1 // Player a is in a team but player b is not, so a comes first
        } else if (!a.team && b.team) {
          return 1 // Player b is in a team but player a is not, so b comes first
        } else {
          return 0 // Both players are either in a team or not, maintain the existing order
        }
      }) || []

  return (
    <>
      <h1>Players</h1>
      <Box>
        <FormControl sx={{ mr: 2, minWidth: 120 }} size='large'>
          <InputLabel id='demo-select-large-label'>Select Team</InputLabel>
          <Select
            labelId='demo-select-large-label'
            id='demo-select-large'
            value={currentTeam}
            label='Team'
            onChange={handleChange}
          >
            <MenuItem value=''>
              <em>All</em>
            </MenuItem>
            {teams.map((el, inx) => {
              return (
                <MenuItem key={inx} value={el._id}>
                  {el.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <TextField label='Search Player' value={search} variant='outlined' onChange={e => setSearch(e.target.value)} />
      </Box>
      <br />
      <Table data={filterData} teams={teams} getUsers={getUsers} edit={true} />
    </>
  )
}

export default Teams
