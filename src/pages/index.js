// ** React and Socket.io Imports
import React, { forwardRef, useEffect, useState } from 'react'

import io from 'socket.io-client'

// ** MUI Imports
import {
  Button,
  Dialog,
  CardContent,
  CardMedia,
  AppBar,
  Typography,
  Slide,
  Box,
  Grid,
  styled,
  Card,
  DialogTitle,
  DialogActions
} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import MuiTab from '@mui/material/Tab'

import ReplayIcon from '@mui/icons-material/Replay'
import GavelIcon from '@mui/icons-material/Gavel'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'

const colorCode = ['#454fa2', '#ff02a5', '#00ff61', '#cbff00', '#ff5817', '#14c2ff', '#ff5f5f', '#b78080']

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4)
}))

function sumOfBid(data) {
  let sum = 0
  for (const item of data) {
    sum += item.bid
  }

  return sum
}

let socket

const Dashboard = () => {
  // ** State
  const [currentType, setCurrentype] = useState('A')
  const [playersData, setPlayersData] = useState([])
  const [isValidAdmin, setIsValidAdmin] = useState(false)
  const [undoDialog, setUndoDialog] = useState(false)
  const [sellDialog, setSellDialog] = useState(false)
  const [currentPlayerBid, setCurrentPlayerBid] = useState(null)

  const [bidProgress, setBidProgress] = useState([])

  const [allTeams, setAllTeams] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('authorization') || ''

    socket = io('http://localhost:3005', {
      transports: ['websocket'],
      query: {
        Authorization: token
      }
    })

    socket.on('playersData', ({ players, team, isAdmin, currentPlayer, bidProgress }) => {
      if (players && players.length) {
        setPlayersData(players)
      }
      if (team && team.length) {
        setAllTeams(team)
      }
      if (currentPlayer) {
        setCurrentPlayerBid(currentPlayer)
      } else {
        setCurrentPlayerBid(null)
      }
      if (bidProgress && bidProgress.length) {
        setBidProgress(bidProgress)
      } else {
        setBidProgress([])
      }
      setIsValidAdmin(isAdmin)
    })

    socket.on('nextPlayerData', ({ players, team, currentPlayer, bidProgress }) => {
      if (players && players.length) {
        setPlayersData(players)
      }
      if (team && team.length) {
        setAllTeams(team)
      }
      if (currentPlayer) {
        setCurrentPlayerBid(currentPlayer)
      } else {
        setCurrentPlayerBid(null)
      }
      if (bidProgress && bidProgress.length) {
        setBidProgress(bidProgress)
      } else {
        setBidProgress([])
      }
    })

    socket.on('currentPlayerBid', ({ currentPlayer }) => {
      if (currentPlayer) {
        setCurrentPlayerBid(currentPlayer)
      }
    })

    socket.on('bidProgress', ({ bidProgress }) => {
      if (bidProgress && bidProgress.length) {
        setBidProgress(bidProgress)
      } else {
        setBidProgress([])
      }
    })

    socket.on('insufficientPurse', ({ team }) => {
      alert(`${team.name} not have sufficient balance`)
    })

    return () => {
      // Cleanup when the component is unmounted
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  const handleChange = (event, newValue) => {
    setCurrentype(newValue)
  }

  const bidStartHandler = () => {
    socket.emit('startbid', { list: currentType })
  }

  const raiseBid = team => {
    socket.emit('raiseBid', { team })
  }

  const undoBid = () => {
    socket.emit('undoBid', {})
    setUndoDialog(false)
  }

  const sellBid = () => {
    socket.emit('sellBid', {})
    setSellDialog(false)
  }

  let data =
    playersData
      .filter(el => el.type == currentType)
      .sort((b, a) => {
        if (a.team && !b.team) {
          return -1 // Player a is in a team but player b is not, so a comes first
        } else if (!a.team && b.team) {
          return 1 // Player b is in a team but player a is not, so b comes first
        } else {
          return 0 // Both players are either in a team or not, maintain the existing order
        }
      }) || []
  let totalPlayers = data.length
  let soldPlayers = data.filter(el => !!el.team).length
  let unsoldPlayers = totalPlayers - soldPlayers

  return (
    <Grid container spacing={6}>
      <h1>SPL - Saringpur Premier League</h1>
      {/* <Grid item xs={12}>
        <TabContext value={currentType}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='A'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>List A</TabName>
                </Box>
              }
            />
            <Tab
              value='B'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>List B</TabName>
                </Box>
              }
            />
            <Tab
              value='C'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>List C</TabName>
                </Box>
              }
            />
          </TabList>
        </TabContext>
        {isValidAdmin && (
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
            >
              <Typography sx={{ fontWeight: 700, mx: 2 }}>Total Players: {totalPlayers}</Typography>
              ||
              <Typography sx={{ fontWeight: 700, mx: 2 }}>Sold Players: {soldPlayers}</Typography>
              ||
              <Typography sx={{ fontWeight: 700, mx: 2 }}>Unsold Players: {unsoldPlayers}</Typography>
            </Box>
            <Box>
              {unsoldPlayers ? (
                <Button variant='contained' onClick={bidStartHandler}>
                  Start Auction
                </Button>
              ) : (
                <Button variant='contained' color='error'>
                  List {currentType} Completed
                </Button>
              )}
            </Box>
          </Box>
        )}
        <Table data={data} />
      </Grid>
      <Dialog fullScreen open={!!currentPlayerBid} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', p: 2 }}>
          <Typography
            sx={{ flex: 1, color: '#fff', textAlign: 'center', textDecoration: 'underline' }}
            variant='h3'
            component='div'
          >
            {currentPlayerBid?.name}
          </Typography>
          <Typography sx={{ flex: 1, color: '#fff', textAlign: 'center' }} variant='h4' component='div'>
            {isValidAdmin && !!bidProgress.length && (
              <Button variant='contained' color='error' sx={{ mr: 3 }} onClick={() => setUndoDialog(true)}>
                <ReplayIcon />
              </Button>
            )}
            {sumOfBid(bidProgress)} Lakh -{' '}
            {(!!bidProgress.length && bidProgress[bidProgress.length - 1]?.name) || 'No bid yet'}
            {isValidAdmin && !!bidProgress.length && (
              <Button variant='contained' color='success' sx={{ ml: 3 }} onClick={() => setSellDialog(true)}>
                <GavelIcon />
              </Button>
            )}
          </Typography>
        </AppBar>
        <Grid container spacing={6} justifyContent={'center'} sx={{ p: 2 }}>
          {isValidAdmin && (
            <Grid item xs={12} md={12}>
              <Grid container spacing={6} justifyContent={'center'}>
                {allTeams.map((el, inx) => {
                  return (
                    <Grid item xs={12} md={3} key={inx}>
                      <Card
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%',
                          p: 1,
                          backgroundColor: colorCode[inx],
                          cursor: 'pointer'
                        }}
                        onClick={() => raiseBid(el)}
                      >
                        <Typography component='div' variant='h5' sx={{ color: '#fff', p: 2 }}>
                          {el?.name}
                          <br />
                          <Typography variant='span' sx={{ color: '#fff', p: 2, fontSize: 16 }}>
                            {el?.totalpurse} Lakh remains
                          </Typography>
                        </Typography>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} md={4}>
            <CardMedia
              component='img'
              sx={{ width: '100%', maxWidth: '100%', m: 'auto' }}
              image={`${process.env.API_BASE_URL}/player/${currentPlayerBid?.photo}`}
              title={currentPlayerBid?.name}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CardContent>
              <Typography gutterBottom variant='h6' component='div'>
                <b>Age:</b> {currentPlayerBid?.age}
              </Typography>
              <Typography gutterBottom variant='h6' component='div'>
                <b>Mobile:</b> {currentPlayerBid?.mobile}
              </Typography>
              <Typography gutterBottom variant='h6' component='div'>
                <b>All Rounder:</b> {currentPlayerBid?.allrounder}
              </Typography>
              <Typography gutterBottom variant='h6' component='div'>
                <b>Bat Style:</b> {currentPlayerBid?.batstyle}
              </Typography>
              <Typography gutterBottom variant='h6' component='div'>
                <b>Bowl Style:</b> {currentPlayerBid?.bowlstyle}
              </Typography>
              <Typography gutterBottom variant='h6' component='div'>
                <b>Wicket Keeper:</b> {currentPlayerBid?.wicketkeeper}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Dialog>

      <Dialog
        open={undoDialog}
        onClose={() => setUndoDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Are you want to undo?'}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setUndoDialog(false)}>No</Button>
          <Button onClick={() => undoBid()} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={sellDialog}
        onClose={() => setSellDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Are you want to end bid?'}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setSellDialog(false)}>No</Button>
          <Button onClick={() => sellBid()} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}
    </Grid>
  )
}

export default Dashboard
