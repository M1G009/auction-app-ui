// ** React and Socket.io Imports
import React, { forwardRef, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

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
  DialogTitle,
  DialogActions
} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import MuiTab from '@mui/material/Tab'

import ReplayIcon from '@mui/icons-material/Replay'
import GavelIcon from '@mui/icons-material/Gavel'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'

const colorCode = ['#1c3664', '#3860a8', '#e15a23', '#00374a', '#0e2242', '#373535', '#ffb92e', '#b6802b']

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

const noOfTeamPlayer = (players, team) => {
  if (players && players.length && team && team._id) {
    return players.filter(el => el?.team?._id == team._id)?.length
  }

  return 0
}

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
  const [unSoldDialog, setunSoldDialog] = useState(false)
  const [sellDialog, setSellDialog] = useState(false)
  const [currentPlayerBid, setCurrentPlayerBid] = useState(null)

  const [bidProgress, setBidProgress] = useState([])

  const [allTeams, setAllTeams] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('authorization') || ''

    socket = io(process.env.API_BASE_URL, {
      transports: ['websocket'],
      query: {
        Authorization: token
      }
    })

    socket.on('isAdmin', ({ isAdmin }) => {
      setIsValidAdmin(isAdmin)
    })

    socket.on('playersData', ({ players, team, currentPlayer, bidProgress }) => {
      setPlayersData(players)
      setAllTeams(team)
      setCurrentPlayerBid(currentPlayer)
      setBidProgress(bidProgress)
    })

    socket.on('newBid', ({ players, team, currentPlayer, bidProgress }) => {
      setPlayersData(players)
      setAllTeams(team)
      setCurrentPlayerBid(currentPlayer)
      setBidProgress(bidProgress)
    })

    socket.on('currentPlayerBid', ({ currentPlayer }) => {
      if (currentPlayer) {
        setCurrentPlayerBid(currentPlayer)
      }
    })

    socket.on('bidProgress', ({ bidProgress }) => {
      setBidProgress(bidProgress)
    })

    socket.on('insufficientPurse', ({ team }) => {
      alert(`${team.name} not have sufficient balance`)
    })

    socket.on('listcomplete', ({}) => {
      setCurrentPlayerBid(null)
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
    socket.emit('newBid', {})
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

  const unSoldBid = () => {
    socket.emit('unSoldBid', {})
    setSellDialog(false)
    setunSoldDialog(false)
  }

  // db.users.updateMany({type: "C"}, {$set: {type: "A"}})

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
      {/* <Grid item xs={12}>
        <h1>SPL - Saringpur Premier League</h1>
      </Grid> */}
      <Grid item xs={12}>
        <TabContext value={currentType}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='Owner'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Owner</TabName>
                </Box>
              }
            />
            <Tab
              value='Captain'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Captain</TabName>
                </Box>
              }
            />
            <Tab
              value='A'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Players</TabName>
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
                ''
              )}
            </Box>
          </Box>
        )}
        <Table data={data} />
      </Grid>
      <Dialog fullScreen open={!!currentPlayerBid} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', p: 2 }}>
          <IconButton
            edge='start'
            color='inherit'
            onClick={() => setCurrentPlayerBid(null)}
            aria-label='close'
            sx={{ position: 'absolute', right: 0, top: 0, color: '#000' }}
          >
            <CloseIcon />
          </IconButton>

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
            {isValidAdmin && (
              <Button variant='contained' color='error' sx={{ ml: 3 }} onClick={() => setunSoldDialog(true)}>
                <DoNotDisturbAltIcon />
              </Button>
            )}
          </Typography>
        </AppBar>
        <Grid container spacing={6} justifyContent={'center'} sx={{ p: 2 }}>
          {isValidAdmin && (
            <Grid item xs={12} md={12}>
              <Grid container spacing={3} justifyContent={'center'}>
                {allTeams.map((el, inx) => {
                  return (
                    <Grid item xs={12} md={3} key={inx}>
                      <Button
                        variant='contained'
                        color='success'
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%',
                          width: '100%',
                          p: 1,
                          backgroundColor: colorCode[inx],
                          cursor: 'pointer'
                        }}
                        disabled={noOfTeamPlayer(playersData, el) == 12}
                        onClick={() => raiseBid(el)}
                      >
                        <Typography component='div' variant='h6' sx={{ color: '#fff', p: 2, fontSize: '22px' }}>
                          {el?.name} ({noOfTeamPlayer(playersData, el) || 0})
                          <br />
                          <Typography variant='span' sx={{ color: '#fff', p: 2, fontSize: 16 }}>
                            {el?.totalpurse} Lakh remains
                          </Typography>
                        </Typography>
                      </Button>
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
        open={unSoldDialog}
        onClose={() => setunSoldDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Are you want to unsold this player?'}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setunSoldDialog(false)}>No</Button>
          <Button onClick={() => unSoldBid()} autoFocus>
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
      </Dialog>
    </Grid>
  )
}

export default Dashboard
