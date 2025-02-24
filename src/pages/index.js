// ** React and Socket.io Imports
import React, { forwardRef, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'

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
  DialogActions,
  DialogContent,
  TextField,
  Card
} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import MuiTab from '@mui/material/Tab'

import ReplayIcon from '@mui/icons-material/Replay'
import GavelIcon from '@mui/icons-material/Gavel'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Image from 'next/image'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

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

const noOfTeamPlayer = (allPlayers, team) => {
  const teamData = { captain: 0, iconPlayer: 0, players: 0, totalSpend: 0 }
  if (allPlayers && allPlayers.length && team && team._id) {
    teamData.iconPlayer = allPlayers.filter(el => el?.team?._id == team._id && el.type == 'IconPlayer')?.length || 0
    teamData.players = allPlayers.filter(el => el?.team?._id == team._id && el.type == 'Player')?.length || 0
    teamData.captain = allPlayers.filter(el => el?.team?._id == team._id && el.type == 'Captain')?.length || 0
    teamData.totalSpend =
      allPlayers.filter(el => el?.team?._id === team._id).reduce((sum, player) => sum + (player?.finalprice || 0), 0) ||
      0
  }
  const { captain, iconPlayer, players } = teamData
  teamData.total = captain + iconPlayer + players

  return teamData
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
  const [currentType, setCurrentype] = useState('Player')
  const [playersData, setPlayersData] = useState([])
  const [isValidAdmin, setIsValidAdmin] = useState(false)
  const [undoDialog, setUndoDialog] = useState(false)
  const [unSoldDialog, setunSoldDialog] = useState(false)
  const [sellDialog, setSellDialog] = useState(false)
  const [currentPlayerBid, setCurrentPlayerBid] = useState(null)
  const [showAd, setShowAd] = useState(false)
  const [auctionSettingModel, setAuctionSettingModel] = useState(false)
  const [auctionSettingData, setAuctionSettingData] = useState({})
  const [soldPlayerData, setSoldPlayerData] = useState(null)

  const [bidProgress, setBidProgress] = useState([])

  const [allTeams, setAllTeams] = useState([])

  useEffect(() => {
    if (soldPlayerData) {
      setTimeout(() => {
        setSoldPlayerData(null)
      }, 3000)
    }
  }, [soldPlayerData])

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

    socket.on('playersData', ({ players, team, currentPlayer, bidProgress, auctionSetting }) => {
      setPlayersData(players)
      setAllTeams(team)
      setCurrentPlayerBid(currentPlayer)
      setBidProgress(bidProgress)
      setAuctionSettingData(auctionSetting)
    })

    socket.on('newBid', ({ players, team, currentPlayer, bidProgress }) => {
      setPlayersData(players)
      setAllTeams(team)
      setCurrentPlayerBid(currentPlayer)
      setBidProgress(bidProgress)
      setShowAd(true)
      setTimeout(() => {
        setShowAd(false)
      }, 2000)
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

  const bidStartHandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'You want to start new bid?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    })

    if (isConfirmed) {
      socket.emit('newBid', {})
    }
  }

  const bidResumeHandler = () => {
    socket.emit('resumeBid', {})
  }

  const resetPlayerAndAmountHandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    })

    if (isConfirmed) {
      socket.emit('resetPlayerAndAmountHandler', {})
    }
  }

  const resetCaptainHandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    })

    if (isConfirmed) {
      socket.emit('resetCaptainHandler', {})
    }
  }

  const resetIconPlayersHandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    })

    if (isConfirmed) {
      socket.emit('resetIconPlayersHandler', {})
    }
  }

  const updateSettinghandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Are you sure, you want to update?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    })

    if (isConfirmed) {
      socket.emit('updateSetting', { data: auctionSettingData })
    }
  }

  const raiseBid = team => {
    socket.emit('raiseBid', { team })
  }

  const undoBid = () => {
    socket.emit('undoBid', {})
    setUndoDialog(false)
  }

  const sellBid = () => {
    const soldPlayerData = { ...currentPlayerBid }
    socket.emit('sellBid', {})
    setSellDialog(false)
    setSoldPlayerData(soldPlayerData)
  }

  const unSoldBid = () => {
    socket.emit('unSoldBid', {})
    setSellDialog(false)
    setunSoldDialog(false)
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
      <Grid item xs={12}>
        <h1>{auctionSettingData?.auctionName || 'Cricket League'}</h1>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={currentType}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='Team'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Teams</TabName>
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
              value='IconPlayer'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Icon Players</TabName>
                </Box>
              }
            />
            <Tab
              value='Player'
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
                <>
                  <Button sx={{ mr: 2 }} variant='contained' onClick={bidStartHandler}>
                    Start Auction
                  </Button>
                  <Button color='secondary' sx={{ mr: 2 }} variant='contained' onClick={bidResumeHandler}>
                    Resume
                  </Button>
                </>
              ) : (
                ''
              )}
              <Button color='error' variant='contained' onClick={() => setAuctionSettingModel(true)}>
                Settings
              </Button>
            </Box>
          </Box>
        )}
        {currentType !== 'Team' ? (
          <Table data={data} />
        ) : (
          <Grid container spacing={3} mt={2}>
            {allTeams.map((el, inx) => {
              return (
                <Grid item key={'test' + inx} xs={12} md={3} lg={3}>
                  <Card>
                    <CardMedia
                      component={'img'}
                      sx={{ width: 362, maxWidth: '100%', aspectRatio: 1, height: '100%' }}
                      image={`${process.env.API_BASE_URL}/team/${el?.logo}`}
                      title={el?.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='div' sx={{ color: '#804bdf' }}>
                        <b>
                          {inx + 1} - {el?.name}
                        </b>
                      </Typography>
                      <Typography gutterBottom variant='h6' component='div'>
                        <b>Owner:</b> {el?.owner}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Dialog fullScreen open={!!currentPlayerBid} TransitionComponent={Transition}>
        <AppBar
          className='auction-header'
          sx={{
            position: 'relative',
            p: '1.5rem'
          }}
        >
          {(!bidProgress.length || !isValidAdmin) && (
            <IconButton
              edge='start'
              color='inherit'
              onClick={() => setCurrentPlayerBid(null)}
              aria-label='close'
              sx={{ position: 'absolute', right: 0, top: 0, color: '#000', p: 0, top: '12px', right: '12px' }}
            >
              <Image src='/close.png' alt='close' width={30} height={30} />
            </IconButton>
          )}

          <Typography
            sx={{
              fontFamily: 'Russo One',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '36px',
              textAlign: 'center',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '2px 3px 3px rgba(0, 0, 0, 0.5)'
            }}
            variant='h3'
            component='div'
          >
            {currentPlayerBid?.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '28px',
              textAlign: 'center',
              letterSpacing: '0.05em',
              color: '#FFFFFF'
            }}
            variant='h4'
            component='div'
          >
            {isValidAdmin && !!bidProgress.length && (
              <Button
                variant='contained'
                color='error'
                sx={{
                  fontFamily: "'Russo One'",
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: '16px',
                  lineHeight: '19px',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  color: '#FFFFFF',
                  background:
                    'linear-gradient(180deg, #B01215 0%, #DA0004 25%, #E6292C 50%, #EF1A1E 75%, #ED2225 100%)',
                  border: '1px solid rgba(244, 245, 250, 0.5)',
                  borderRadius: '3px',
                  mr: 3
                }}
                onClick={() => setUndoDialog(true)}
              >
                <ReplayIcon />
              </Button>
            )}
            {sumOfBid(bidProgress)} Lakh -{' '}
            {(!!bidProgress.length && bidProgress[bidProgress.length - 1]?.name) || 'No bid yet'}
            {isValidAdmin && !!bidProgress.length && (
              <Button
                variant='contained'
                color='success'
                sx={{
                  fontFamily: "'Russo One'",
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: '16px',
                  lineHeight: '19px',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  color: '#FFFFFF',
                  background:
                    'linear-gradient(180deg, #18B222 0%, #11BC35 25%, #0FD036 50%, #12E134 75%, #00FF2A 100%)',
                  border: '1px solid rgba(244, 245, 250, 0.5)',
                  borderRadius: '3px',
                  ml: 3
                }}
                onClick={() => setSellDialog(true)}
              >
                <GavelIcon />
              </Button>
            )}
            {isValidAdmin && !bidProgress.length && (
              <Button
                variant='contained'
                color='error'
                onClick={() => setunSoldDialog(true)}
                sx={{
                  fontFamily: "'Russo One'",
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: '16px',
                  lineHeight: '19px',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  color: '#FFFFFF',
                  background:
                    'linear-gradient(180deg, #B01215 0%, #DA0004 25%, #E6292C 50%, #EF1A1E 75%, #ED2225 100%)',
                  border: '1px solid rgba(244, 245, 250, 0.5)',
                  borderRadius: '3px',
                  ml: 3
                }}
              >
                Unsold
              </Button>
            )}
          </Typography>
        </AppBar>
        <Grid container spacing={6} justifyContent={'center'} sx={{ px: 5, mt: 4 }}>
          <Grid item xs={12} md={6} lg={4}>
            <Box
              sx={{
                background: '#FFFFFF',
                boxShadow: '1px 3px 25px rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                padding: '1rem'
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component='img'
                  sx={{ width: '100%', maxWidth: '100%', m: 'auto', borderRadius: '10px', aspectRatio: 1 }}
                  image={`${process.env.API_BASE_URL}/player/${currentPlayerBid?.photo}`}
                  title={currentPlayerBid?.name}
                />
                {currentPlayerBid?.mobile && (
                  <Typography
                    gutterBottom
                    variant='h6'
                    component='div'
                    sx={{
                      position: 'absolute',
                      bottom: '5%',
                      right: '0',
                      left: '0',
                      textAlign: 'center',
                      padding: '10px',
                      background:
                        'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0 0 0 / 67%) 20.03%, rgb(0 0 0) 50%, rgb(0 0 0 / 66%) 79.69%, rgba(0, 0, 0, 0) 100%)',
                      color: '#FFFFFF',
                      fontFamily: "'Russo One'",
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '24px',
                      lineHeight: '29px',
                      letterSpacing: '0.1em',
                      textShadow: '1px 2px 5px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    Mo. {currentPlayerBid?.mobile}
                  </Typography>
                )}
              </Box>
              <CardContent>
                <Grid container spacing={2} justifyContent={'center'}>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      sx={{
                        fontFamily: "'Russo One'",
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '24px',
                        lineHeight: '29px',
                        textAlign: 'center',
                        letterSpacing: '0.05em',
                        color: '#000000',
                        textShadow: '2px 3px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      Batsman
                    </Typography>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      sx={{
                        fontFamily: "'Inter'",
                        fontStyle: 'normal',
                        fontWeight: '600',
                        fontSize: '14px',
                        lineHeight: '17px',
                        textAlign: 'center',
                        letterSpacing: '0.1em',
                        color: '#000000'
                      }}
                    >
                      {currentPlayerBid?.batstyle ? 'YES' : 'NO'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      sx={{
                        fontFamily: "'Russo One'",
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '24px',
                        lineHeight: '29px',
                        textAlign: 'center',
                        letterSpacing: '0.05em',
                        color: '#000000',
                        textShadow: '2px 3px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      Bowler
                    </Typography>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      sx={{
                        fontFamily: "'Inter'",
                        fontStyle: 'normal',
                        fontWeight: '600',
                        fontSize: '14px',
                        lineHeight: '17px',
                        textAlign: 'center',
                        letterSpacing: '0.1em',
                        color: '#000000'
                      }}
                    >
                      {currentPlayerBid?.bowlstyle ? 'YES' : 'NO'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      sx={{
                        fontFamily: "'Russo One'",
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '24px',
                        lineHeight: '29px',
                        textAlign: 'center',
                        letterSpacing: '0.05em',
                        color: '#000000',
                        textShadow: '2px 3px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      Wicket Keeper
                    </Typography>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      sx={{
                        fontFamily: "'Inter'",
                        fontStyle: 'normal',
                        fontWeight: '600',
                        fontSize: '14px',
                        lineHeight: '17px',
                        textAlign: 'center',
                        letterSpacing: '0.1em',
                        color: '#000000'
                      }}
                    >
                      {currentPlayerBid?.wicketkeeper ? 'YES' : 'NO'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Box>
          </Grid>
          {isValidAdmin && (
            <Grid item xs={8}>
              <Grid container spacing={3} justifyContent={'center'}>
                {allTeams.map((el, inx) => {
                  let teamPlayers = noOfTeamPlayer(playersData, el)
                  let reservePlayers = teamPlayers?.captain + teamPlayers?.iconPlayer
                  let totalPlayersOfTeam = teamPlayers?.total || 0

                  let reserveBalance =
                    (auctionSettingData?.maxPlayersPerteam -
                      auctionSettingData?.reservePlayersPerTeam -
                      teamPlayers?.players) *
                    (auctionSettingData?.startBid || 1)
                  let teamBalance = 100 - teamPlayers?.totalSpend - reserveBalance

                  const disabled =
                    totalPlayersOfTeam == auctionSettingData?.maxPlayersPerteam ||
                    el?.teamBalance == 0 ||
                    sumOfBid(bidProgress) >= teamBalance + (auctionSettingData?.startBid || 1)

                  const currentBidTeam = (!!bidProgress.length && bidProgress[bidProgress.length - 1]?.id) === el.id

                  return (
                    <Grid item xs={12} md={4} key={inx}>
                      <Button
                        variant='contained'
                        color='success'
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%',
                          width: '100%',
                          p: 1,
                          background: disabled ? '#4d4d4d' : `url(/button/${inx + 1}.png)`,
                          cursor: currentBidTeam ? 'not-allowed' : 'pointer',
                          backgroundSize: '100% 100%',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          boxShadow: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '15px 15px 30px 15px'
                        }}
                        className={currentBidTeam ? 'slide-fwd-center' : ''}
                        disabled={disabled}
                        onClick={() => raiseBid(el)}
                      >
                        <Typography
                          component='p'
                          sx={{
                            fontFamily: "'Russo One'",
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '22px',
                            lineHeight: '27px',
                            textAlign: 'center',
                            letterSpacing: '0.05em',
                            color: '#FFFFFF',
                            textShadow: '2px 3px 3px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          {el?.name}
                        </Typography>
                        <Typography
                          component='p'
                          sx={{
                            fontFamily: "'Inter'",
                            fontStyle: 'normal',
                            fontWeight: '700',
                            fontSize: '18px',
                            lineHeight: '22px',
                            textAlign: 'center',
                            letterSpacing: '0.1em',
                            color: '#FFFFFF'
                          }}
                        >{`${reservePlayers} Fix / ${teamPlayers?.players} Players `}</Typography>
                        <Typography
                          component='p'
                          sx={{
                            fontFamily: "'Inter'",
                            fontStyle: 'normal',
                            fontWeight: '700',
                            fontSize: '18px',
                            lineHeight: '22px',
                            textAlign: 'center',
                            letterSpacing: '0.1em',
                            color: '#FFFFFF'
                          }}
                        >
                          {teamBalance} L + <b>{reserveBalance} L</b> = {teamBalance + reserveBalance} L
                        </Typography>
                      </Button>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          )}
        </Grid>
        {showAd && !isValidAdmin && (
          <Box
            sx={{
              padding: '0.75rem',
              position: 'absolute',
              zIndex: '9999',
              inset: '0',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <p style={{ color: '#000', textAlign: 'center', margin: 0 }}>Developed by...</p>
            <a href='https://www.cdmi.in/' target='_blank' rel='noreferrer'>
              <CardMedia
                component={'img'}
                sx={{ width: '100%', maxWidth: '100%' }}
                image={`/creative-logo-blue.svg`}
                title={'Creative Design and Multimedia Institute'}
              />
            </a>
          </Box>
        )}
        {/* <Dialog open={soldPlayerData} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
          <PlayerCard data={soldPlayerData} />
        </Dialog> */}
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

      <BootstrapDialog
        onClose={() => setAuctionSettingModel(false)}
        aria-labelledby='customized-dialog-title'
        open={auctionSettingModel}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Auction Settings
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={() => setAuctionSettingModel(false)}
          sx={theme => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
            <Button variant='contained' color='error' onClick={resetPlayerAndAmountHandler}>
              Reset Players and Amount
            </Button>
            <Button variant='contained' color='error' onClick={resetCaptainHandler}>
              Reset Captains
            </Button>
            <Button variant='contained' color='error' onClick={resetIconPlayersHandler}>
              Reset Icon Players
            </Button>
            <TextField
              label='Auction Title'
              value={auctionSettingData?.auctionName || 'Cricket League'}
              variant='outlined'
              onChange={e => setAuctionSettingData({ ...auctionSettingData, auctionName: e.target.value })}
              onBlur={updateSettinghandler}
            />
            <TextField
              type='number'
              label='Max Players'
              value={auctionSettingData?.maxPlayersPerteam || 0}
              variant='outlined'
              onChange={e => setAuctionSettingData({ ...auctionSettingData, maxPlayersPerteam: e.target.value })}
              onBlur={updateSettinghandler}
            />
            <TextField
              type='number'
              label='Reserve Players'
              value={auctionSettingData?.reservePlayersPerTeam || 0}
              variant='outlined'
              onChange={e => setAuctionSettingData({ ...auctionSettingData, reservePlayersPerTeam: e.target.value })}
              onBlur={updateSettinghandler}
            />
            <TextField
              type='number'
              label='Starting Bid'
              value={auctionSettingData?.startBid || 1}
              variant='outlined'
              onChange={e => setAuctionSettingData({ ...auctionSettingData, startBid: e.target.value })}
              onBlur={updateSettinghandler}
            />
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </Grid>
  )
}

export default Dashboard
