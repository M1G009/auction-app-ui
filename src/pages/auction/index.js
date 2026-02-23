import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import io from 'socket.io-client'
import axios from 'axios'
import Lottie from 'lottie-react'

import {
  Button,
  Dialog,
  CardContent,
  CardMedia,
  AppBar,
  Typography,
  Box,
  Grid,
  styled,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Card,
  Avatar
} from '@mui/material'

import RemoveIcon from '@mui/icons-material/Remove'
import CancelIcon from '@mui/icons-material/Cancel'

import UserLayout from 'src/layouts/UserLayout'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': { padding: theme.spacing(2) },
  '& .MuiDialogActions-root': { padding: theme.spacing(1) }
}))

const StyledDialog = styled(BootstrapDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    margin: theme.spacing(1),
    maxWidth: 'calc(100% - 16px)',
    [theme.breakpoints.up('sm')]: { borderRadius: '20px', margin: theme.spacing(2) }
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '15px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
  }
}))

const AuctionHeader = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  position: 'relative',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 2),
  minHeight: 120,
  [theme.breakpoints.up('sm')]: { minHeight: 140, padding: theme.spacing(2, 3) },
  [theme.breakpoints.up('md')]: { minHeight: 160, padding: '0px 15px' },
  '& *': { color: '#fff' },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
  }
}))

const PlayerCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: 'none',
  background: 'transparent',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: { borderRadius: '20px' },
  [theme.breakpoints.up('md')]: { borderRadius: '24px' }
}))

const BidDisplay = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  padding: theme.spacing(2, 2),
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  color: '#ffffff',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(2, 3), borderRadius: '20px' },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(3, 4) },
  '& *': { color: '#ffffff' }
}))

const TeamButton = styled(Button)(({ theme, $isactive, $isdisabled }) => ({
  borderRadius: '10px',
  padding: theme.spacing(1),
  minHeight: 120,
  [theme.breakpoints.up('sm')]: { minHeight: 160, borderRadius: '14px' },
  [theme.breakpoints.up('md')]: { minHeight: '200px', borderRadius: '16px' },
  background: $isdisabled
    ? '#8f8f8f'
    : $isactive
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  backdropFilter: 'blur(10px)',
  border: $isactive ? '3px solid #667eea' : '2px solid rgba(255,255,255,0.2)',
  boxShadow: $isactive ? '0 8px 32px rgba(102, 126, 234, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  color: $isactive || $isdisabled ? '#fff' : '#2d2d44',
  '& *': { color: $isactive || $isdisabled ? '#fff' : '#2d2d44' },
  '& *[style*="color: #ee5a6f"]': { color: '#ee5a6f !important' },
  '&:hover': {
    transform: $isdisabled ? 'none' : 'translateY(-4px) scale(1.02)',
    boxShadow: $isactive ? '0 12px 40px rgba(102, 126, 234, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.3)'
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    '& *': { color: '#fff' }
  }
}))

const SkillBadge = styled(Box)(({ theme, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5, 1),
  padding: '0.35rem 0.6rem 0.35rem 0.35rem',
  borderRadius: '16px',
  fontSize: '0.75rem',
  [theme.breakpoints.up('sm')]: { padding: '0.5rem 1rem 0.5rem 0.5rem', borderRadius: '20px', fontSize: '0.875rem' },
  background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.05)',
  color: active ? '#fff' : theme.palette.text.secondary,
  fontWeight: 600,
  boxShadow: active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
  ...(active && { '& *': { color: '#fff' } })
}))

const noOfTeamPlayer = (allPlayers, team) => {
  const teamData = { captain: 0, iconPlayer: 0, players: 0, totalSpend: 0 }
  if (allPlayers && allPlayers.length && team && team._id) {
    teamData.iconPlayer = allPlayers.filter(el => el?.team?._id == team._id && el.type == 'IconPlayer')?.length || 0
    teamData.players = allPlayers.filter(el => el?.team?._id == team._id && el.type == 'Player')?.length || 0
    teamData.captain = allPlayers.filter(el => el?.team?._id == team._id && el.type == 'Captain')?.length || 0
    teamData.totalSpend =
      allPlayers.filter(el => el?.team?._id === team._id).reduce((sum, player) => sum + (player?.finalprice || 0), 0) || 0
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

function SoldLottieFullScreen({ onComplete }) {
  const [celebrationData, setCelebrationData] = useState(null)
  const celebrationRef = useRef(null)

  useEffect(() => {
    fetch('/celebration.json')
      .then(r => r.json())
      .then(setCelebrationData)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (onComplete) onComplete()
    }, 3000)

    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {celebrationData && (
        <Lottie
          lottieRef={celebrationRef}
          animationData={celebrationData}
          loop={false}
          onDataReady={() => celebrationRef.current?.setSpeed(0.1)}
        />
      )}
    </Box>
  )
}

let socket

function useKeyboardBidEffect({ enabled, bidProgress, allTeams, playersData, auctionSettingData }) {
  const currentBidTeam =
    bidProgress?.length > 0 && bidProgress[bidProgress.length - 1]?.teamId
      ? allTeams.find(t => t._id === bidProgress[bidProgress.length - 1].teamId) || null
      : null

  useEffect(() => {
    if (!enabled) {
      return () => {}
    }

    const raiseBid = team => {
      if (team) socket.emit('raiseBid', { team })
    }

    const undoBid = () => {
      socket.emit('undoBid', {})
    }

    const handleKeyUp = e => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) {
        return
      }

      const bidIncrement = Number(auctionSettingData?.bidIncrement) || 1
      if (e.keyCode === 187 || e.key === '+') {
        e.preventDefault()
        if (currentBidTeam) {
          const teamPlayers = noOfTeamPlayer(playersData, currentBidTeam)
          const currentBidAmount = sumOfBid(bidProgress)
          const startBid = auctionSettingData?.startBid || 1

          const reservePlayersNeeded =
            (auctionSettingData?.maxPlayersPerteam || 11) -
            (auctionSettingData?.reservePlayersPerTeam || 0) -
            (teamPlayers?.players || 0)
          const reserveBalance = reservePlayersNeeded * startBid
          const availableBalance = 100 - reserveBalance - (teamPlayers?.totalSpend || 0)
          const maxBidAmount = availableBalance > 0 ? availableBalance + startBid : startBid
          const nextBidAmount = Number(currentBidAmount) + bidIncrement

          if (nextBidAmount <= Number(maxBidAmount)) raiseBid(currentBidTeam)
        }
      } else if (e.keyCode === 189 || e.key === '-') {
        e.preventDefault()
        if (bidProgress.length > 0) undoBid()
      } else if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        const inx = e.key === '0' ? 9 : parseInt(e.key, 10) - 1
        if (inx >= 0 && inx < allTeams.length) {
          const team = allTeams[inx]
          if (team && currentBidTeam?._id !== team._id) {
            const teamPlayers = noOfTeamPlayer(playersData, team)
            const currentBidAmount = sumOfBid(bidProgress)
            const startBid = auctionSettingData?.startBid || 1

            const reservePlayersNeeded =
              (auctionSettingData?.maxPlayersPerteam || 11) -
              (auctionSettingData?.reservePlayersPerTeam || 0) -
              (teamPlayers?.players || 0)
            const reserveBalance = reservePlayersNeeded * startBid
            const availableBalance = 100 - reserveBalance - (teamPlayers?.totalSpend || 0)
            const maxBidAmount = availableBalance > 0 ? availableBalance + startBid : startBid
            const nextBidAmount = Number(currentBidAmount) + bidIncrement

            const isDisabled =
              teamPlayers?.total === auctionSettingData?.maxPlayersPerteam ||
              (availableBalance <= 0 && Number(currentBidAmount) > Number(startBid)) ||
              (availableBalance > 0 && nextBidAmount > Number(maxBidAmount)) ||
              (Number(currentBidAmount) === Number(maxBidAmount) && currentBidTeam?._id !== team._id)

            if (!isDisabled) raiseBid(team)
          }
        }
      }
    }

    window.addEventListener('keyup', handleKeyUp)

    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [enabled, currentBidTeam, bidProgress, allTeams, playersData, auctionSettingData])
}

const AuctionPage = () => {
  const [playersData, setPlayersData] = useState([])
  const [allTeams, setAllTeams] = useState([])
  const [auctionSettingData, setAuctionSettingData] = useState({})
  const [isValidAdmin, setIsValidAdmin] = useState(false)
  const [currentPlayerBid, setCurrentPlayerBid] = useState(null)
  const [bidProgress, setBidProgress] = useState([])
  const [selectedPlayerIsSold, setSelectedPlayerIsSold] = useState(false)
  const [playerNumberInput, setPlayerNumberInput] = useState('')
  const [unSoldDialog, setunSoldDialog] = useState(false)
  const [sellDialog, setSellDialog] = useState(false)
  const [selectedTeamForSell, setSelectedTeamForSell] = useState(null)
  const [showSellSuccess, setShowSellSuccess] = useState(false)
  const pendingSellRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('authorization') || ''

    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.API_BASE_URL}/api/v1/auction-setting?t=${Date.now()}`, {
          headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
        })
        if (res.data.data) {
          setAuctionSettingData(res.data.data)
        }
      } catch (e) {
        console.log('Failed to fetch settings', e)
      }
    }
    fetchSettings()

    socket = io(process.env.API_BASE_URL, {
      transports: ['websocket'],
      query: token ? { Authorization: token } : {}
    })

      socket.on('isAdmin', ({ isAdmin }) => {
        setIsValidAdmin(isAdmin)
      })

      socket.on('playersData', ({ players, team, currentPlayer, bidProgress: bp, auctionSetting }) => {
        const pending = pendingSellRef.current
        if (pending && currentPlayer === null && players?.length) {
          const soldPlayer = players.find(
            p =>
              p._id === pending.playerId &&
              p.team &&
              (p.team._id === pending.teamId || p.team === pending.teamId)
          )
          if (soldPlayer) {
            setShowSellSuccess(true)
            pendingSellRef.current = null
          }
        }
        setPlayersData(players || [])
        setAllTeams(team || [])

        setCurrentPlayerBid(prev => {
          if (currentPlayer !== null) {
            return currentPlayer
          }

          if (!prev || !players?.length) {
            return prev
          }

          const samePlayer = players.find(
            p => p._id === prev._id || String(p.playerNumber) === String(prev.playerNumber)
          )
          if (samePlayer) {
            setSelectedPlayerIsSold(!!samePlayer.team)
            if (!pending && samePlayer.team) {
              setShowSellSuccess(true)
            }

            return samePlayer
          }

          return prev
        })
        setBidProgress(bp || [])

        if (auctionSetting) {
          setAuctionSettingData(auctionSetting)
        }
      })

      socket.on('newBid', ({ players, team, currentPlayer, bidProgress: bp }) => {
        setPlayersData(players || [])
        setAllTeams(team || [])
        setCurrentPlayerBid(currentPlayer)
        setBidProgress(bp || [])
        setSelectedPlayerIsSold(false)
      })

      socket.on('currentPlayerBid', ({ currentPlayer }) => {
        if (currentPlayer) {
          setCurrentPlayerBid(currentPlayer)
        }
      })

      socket.on('bidProgress', ({ bidProgress: bp }) => setBidProgress(bp || []))

      socket.on('insufficientPurse', ({ team }) => {
        pendingSellRef.current = null
        alert(`${team.name} not have sufficient balance`)
      })

      socket.on('sellError', ({ message }) => {
        pendingSellRef.current = null
        if (message) alert(message)
      })

      socket.on('listcomplete', () => {
        setCurrentPlayerBid(null)
        setSelectedPlayerIsSold(false)
      })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  useKeyboardBidEffect({
    enabled: !!currentPlayerBid && !!isValidAdmin,
    bidProgress,
    allTeams,
    playersData,
    auctionSettingData
  })

  const currentBidTeam =
    bidProgress?.length > 0 && bidProgress[bidProgress.length - 1]?.teamId
      ? allTeams.find(t => t._id === bidProgress[bidProgress.length - 1].teamId) || null
      : null

  const remainingPlayers = playersData.filter(p => !p.team).length
  const showPlayerSection = currentPlayerBid && remainingPlayers > 0

  const raiseBid = team => {
    if (team && socket) {
      socket.emit('raiseBid', { team })
    }
  }

  const undoBid = () => {
    if (socket) {
      socket.emit('undoBid', {})
    }
  }

  const sellBid = selectedTeam => {
    if (!selectedTeam) {
      return
    }

    pendingSellRef.current = { playerId: currentPlayerBid?._id, teamId: selectedTeam._id || selectedTeam.id }
    socket.emit('sellBid', { team: selectedTeam })
    setSellDialog(false)
    setSelectedTeamForSell(null)
  }

  const handleNextPlayer = () => {
    pendingSellRef.current = null
    setShowSellSuccess(false)
    setSellDialog(false)
    setSelectedTeamForSell(null)
  }

  const unSoldBid = () => {
    socket.emit('unSoldBid', {})
    setSellDialog(false)
    setunSoldDialog(false)
  }

  const maxPlayerNum = playersData.length
    ? Math.max(1, ...playersData.map(p => p.playerNumber).filter(n => n != null && n !== '')) || playersData.length
    : 1

  const submitPlayerNumber = () => {
    if (currentPlayerBid && bidProgress.length > 0) {
      return
    }

    const num = parseInt(playerNumberInput, 10)
    if (isNaN(num) || num < 1) {
      if (playerNumberInput.trim() !== '') {
        setPlayerNumberInput('')
      }

      return
    }
    const clamped = Math.min(maxPlayerNum, Math.max(1, num))
    const found = playersData.find(p => p.playerNumber != null && Number(p.playerNumber) === clamped)
    if (!found) {
      setPlayerNumberInput('')

      return
    }
    if (found.team) {
      setCurrentPlayerBid(found)
      setSelectedPlayerIsSold(true)
      setBidProgress([])
      setPlayerNumberInput('')
    } else if (found.type === 'Unsold') {
      setCurrentPlayerBid(found)
      setBidProgress([])
      setPlayerNumberInput('')
    } else if (socket) {
      socket.emit('selectPlayerByNumber', { playerNumber: clamped })
      setPlayerNumberInput('')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <AuctionHeader position='static'>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: { xs: 1.5, md: 1 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Link href='/' passHref legacyBehavior>
              <IconButton
                component='a'
                sx={{
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Link>
            {isValidAdmin && (
              <TextField
                size='small'
                type='text'
                inputMode='numeric'
                placeholder='Player No.'
                disabled={!!(currentPlayerBid && bidProgress.length > 0)}
                value={playerNumberInput}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '')
                  if (raw === '') setPlayerNumberInput('')
                  else {
                    const num = parseInt(raw, 10)
                    if (!isNaN(num)) setPlayerNumberInput(String(Math.min(maxPlayerNum, Math.max(1, num))))
                  }
                }}
                onBlur={submitPlayerNumber}
                onKeyDown={e => e.key === 'Enter' && submitPlayerNumber()}
                inputProps={{ style: { color: '#fff', width: 100 } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' }
                  }
                }}
              />
            )}
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
            {currentPlayerBid ? (
              <>
                <Typography
                  variant='h3'
                  sx={{
                    fontFamily: 'Russo One',
                    fontWeight: 400,
                    fontSize: { xs: '18px', sm: '24px', md: '42px' },
                    color: '#fff',
                    textShadow: '2px 4px 8px rgba(0, 0, 0, 0.3)',
                    mb: 1,
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                  }}
                >
                  {currentPlayerBid?.playerNumber != null && currentPlayerBid?.playerNumber !== ''
                    ? `${currentPlayerBid.playerNumber} - ${currentPlayerBid?.name}`
                    : currentPlayerBid?.name}
                </Typography>
                {currentPlayerBid?.type === 'Unsold' && isValidAdmin && (
                  <Button
                    variant='contained'
                    onClick={() => {
                      if (socket && currentPlayerBid?._id) {
                        socket.emit('resetSinglePlayer', { playerId: currentPlayerBid._id })
                      }
                    }}
                    sx={{
                      mt: 2,
                      borderRadius: '12px',
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 1, sm: 1.25 },
                      fontWeight: 700,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#ffffff',
                      '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }
                    }}
                  >
                    Reset player
                  </Button>
                )}
                {currentPlayerBid?.type !== 'Unsold' && (
                  <BidDisplay sx={{ maxWidth: '600px', width: '100%', mx: 'auto', mt: { xs: 1.5, md: 2 }, px: { xs: 1, sm: 2 } }}>
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: { xs: 1.5, sm: 2 }
                      }}
                    >
                      {isValidAdmin && !selectedPlayerIsSold && (
                        <>
                          {bidProgress.length > 0 ? (
                            <IconButton
                              onClick={undoBid}
                              sx={{
                                borderRadius: '12px',
                                width: { xs: 44, sm: 56 },
                                height: { xs: 44, sm: 56 },
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: '#ffffff',
                                '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => setunSoldDialog(true)}
                              sx={{
                                borderRadius: '12px',
                                width: { xs: 44, sm: 56 },
                                height: { xs: 44, sm: 56 },
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                                color: '#ffffff',
                                '&:hover': { background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)' }
                              }}
                            >
                              <CancelIcon />
                            </IconButton>
                          )}
                        </>
                      )}
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography
                          variant='h2'
                          sx={{
                            fontFamily: 'Russo One',
                            fontSize: { xs: '28px', sm: '36px', md: '56px' },
                            color: '#ffffff',
                            fontWeight: 700
                          }}
                        >
                          {((selectedPlayerIsSold || currentPlayerBid?.team) && (currentPlayerBid?.finalprice != null))
                            ? currentPlayerBid.finalprice
                            : sumOfBid(bidProgress)}{' '}
                          Lakh
                        </Typography>
                        {!isValidAdmin && currentBidTeam && (
                          <Typography
                            variant='subtitle1'
                            sx={{
                              color: 'rgba(255, 255, 255, 0.95)',
                              fontWeight: 600,
                              mt: 0.5,
                              fontSize: { xs: '1rem', md: '1.25rem' }
                            }}
                          >
                            {currentBidTeam.name}
                          </Typography>
                        )}
                      </Box>
                      {isValidAdmin && (
                        <Button
                          onClick={() => {
                            if (currentBidTeam) {
                              setSelectedTeamForSell(currentBidTeam)
                              setSellDialog(true)
                            }
                          }}
                          disabled={selectedPlayerIsSold || !bidProgress.length || !currentBidTeam}
                          sx={{
                            borderRadius: '12px',
                            minWidth: { xs: 48, sm: 56 },
                            height: { xs: 44, sm: 56 },
                            px: 2,
                            background: 'linear-gradient(135deg, #56CA00 0%, #6AD01F 100%)',
                            color: '#ffffff',
                            fontWeight: 700,
                            textTransform: 'none',
                            '&:hover': { background: 'linear-gradient(135deg, #6AD01F 0%, #56CA00 100%)' },
                            '&:disabled': { opacity: 0.5 }
                          }}
                        >
                          Sold
                        </Button>
                      )}
                      {isValidAdmin && (selectedPlayerIsSold || currentPlayerBid?.team) && (
                        <Button
                          variant='contained'
                          onClick={() => {
                            if (socket && currentPlayerBid?._id) {
                              socket.emit('resetSinglePlayer', { playerId: currentPlayerBid._id })
                              setSelectedPlayerIsSold(false)
                            }
                          }}
                          sx={{
                            borderRadius: '12px',
                            minWidth: { xs: 48, sm: 56 },
                            height: { xs: 44, sm: 56 },
                            px: { xs: 1.5, sm: 2 },
                            ml: { xs: 0, sm: 1 },
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: '#ffffff',
                            fontWeight: 700,
                            textTransform: 'none',
                            '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }
                          }}
                        >
                          Reset player
                        </Button>
                      )}
                    </Box>
                  </BidDisplay>
                )}
              </>
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                Enter player number or click Random to start
              </Typography>
            )}
          </Box>
          {isValidAdmin && (
            <Button
              variant='contained'
              disabled={!!(currentPlayerBid && bidProgress.length > 0)}
              onClick={() => {
                if (socket) {
                  socket.emit('newBid', {})
                  setPlayerNumberInput('')
                }
              }}
              sx={{
                borderRadius: '12px',
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1, sm: 1.25 },
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' }
              }}
            >
              Random
            </Button>
          )}
        </Box>
      </AuctionHeader>

      <Box
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          minHeight: { xs: 'calc(100vh - 140px)', sm: 'calc(100vh - 160px)', md: 'calc(100vh - 180px)' },
          pb: { xs: 'max(80px, calc(env(safe-area-inset-bottom) + 56px))', sm: 7 },
          height: '100%',
          overflow: 'auto'
        }}
      >
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent='center' sx={{ height: '100%' }}>
          {showPlayerSection && (
            <Grid item xs={12} md={4} lg={4}>
              <PlayerCard>
                {!isValidAdmin && (currentBidTeam || currentPlayerBid?.team) && (
                  <Box
                    sx={{
                      py: 1.5,
                      px: 2,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff'
                    }}
                  >
                    <Typography variant='subtitle1' sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                      {(currentBidTeam || currentPlayerBid?.team)?.name}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  {currentPlayerBid?.photo ? (
                    <CardMedia
                      component='img'
                      image={`${process.env.API_BASE_URL}/player/${currentPlayerBid.photo}`}
                      alt={currentPlayerBid?.name}
                      sx={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: 220, sm: 280, md: 400 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff'
                      }}
                    >
                      <Typography variant='h2' sx={{ fontWeight: 700 }}>
                        {currentPlayerBid?.name?.charAt(0) || '?'}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {currentPlayerBid?.batstyle && (
                      <SkillBadge active={currentPlayerBid?.batstyle}>
                        <Box component='span'>🏏</Box>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: '#fff' }}>BATSMAN</Typography>
                      </SkillBadge>
                    )}
                    {currentPlayerBid?.bowlstyle && (
                      <SkillBadge active={currentPlayerBid?.bowlstyle}>
                        <Box component='span'>⚾</Box>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: '#fff' }}>BOWLER</Typography>
                      </SkillBadge>
                    )}
                    {currentPlayerBid?.wicketkeeper && (
                      <SkillBadge active={currentPlayerBid?.wicketkeeper}>
                        <Box component='span'>🧤</Box>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: '#fff' }}>WICKET KEEPER</Typography>
                      </SkillBadge>
                    )}
                  </Box>
                </CardContent>
              </PlayerCard>
            </Grid>
          )}

          <Grid item xs={12} md={showPlayerSection ? 8 : 12} sx={!showPlayerSection ? { display: 'flex', justifyContent: 'center', alignItems: 'flex-start' } : {}}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', ...(!showPlayerSection && { maxWidth: 900, width: '100%', mx: 'auto' }) }}>
                {showPlayerSection && currentPlayerBid?.type === 'Unsold' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, width: '100%', p: 2 }}>
                    <Box component='img' src='/unsold.png' alt='Unsold' sx={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }} />
                  </Box>
                ) : (
                  <Grid
                    container
                    spacing={{ xs: 1.5, sm: 2 }}
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                    justifyContent='center'
                    alignItems='center'
                  >
                    {allTeams.map((el, inx) => {
                      const teamCount = allTeams.length
                      const gridSize = teamCount <= 4 ? 3 : teamCount <= 6 ? 4 : 3

                      const teamPlayers = noOfTeamPlayer(playersData, el)

                      const reservePlayersNeeded =
                        (auctionSettingData?.maxPlayersPerteam || 11) -
                        (auctionSettingData?.reservePlayersPerTeam || 0) -
                        (teamPlayers?.players || 0)
                      const startBid = auctionSettingData?.startBid || 1
                      const reserveBalance = reservePlayersNeeded * startBid
                      const availableBalance = 100 - reserveBalance - (teamPlayers?.totalSpend || 0)
                      const currentBidAmount = sumOfBid(bidProgress)
                      const maxPlayers = auctionSettingData?.maxPlayersPerteam || 11
                      const teamFull = (teamPlayers?.total ?? 0) >= maxPlayers
                      const maxBidAmount = teamFull ? 0 : (availableBalance > 0 ? availableBalance + startBid : 0)

                      const isDisabled =
                        !currentPlayerBid ||
                        currentPlayerBid?.type === 'Unsold' ||
                        selectedPlayerIsSold ||
                        teamFull ||
                        availableBalance <= 0 ||
                        (availableBalance <= 0 && Number(currentBidAmount) > Number(startBid)) ||
                        (availableBalance > 0 && Number(currentBidAmount) > Number(maxBidAmount)) ||
                        (Number(currentBidAmount) >= Number(maxBidAmount) && currentBidTeam?._id !== el._id)

                      return (
                        <Grid item xs={teamCount <= 2 ? 12 : 6} sm={gridSize} md={gridSize} lg={gridSize} key={inx}>
                          <TeamButton
                            $isactive={currentBidTeam?._id === el._id}
                            $isdisabled={isDisabled}
                            onClick={() => {
                              if (!isValidAdmin || currentBidTeam?._id === el._id || isDisabled) return
                              raiseBid(el)
                            }}
                            fullWidth
                          >
                            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%' }}>
                              {selectedPlayerIsSold && currentPlayerBid?.team && (el._id === currentPlayerBid.team._id || el._id === currentPlayerBid.team) && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pointerEvents: 'none'
                                  }}
                                >
                                  <Box component='img' src='/sold.png' alt='Sold' sx={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', opacity: 0.6 }} />
                                </Box>
                              )}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  minWidth: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  background: '#0000002e',
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.875rem'
                                }}
                              >
                                {inx + 1}
                              </Box>
                              {el.logo && (
                                <Box
                                  component='img'
                                  src={`${process.env.API_BASE_URL}/team/${el.logo}`}
                                  alt={el.name}
                                  sx={{ width: { xs: 44, sm: 52, md: 60 }, height: { xs: 44, sm: 52, md: 60 }, objectFit: 'contain', borderRadius: '8px' }}
                                />
                              )}
                              <Typography variant='subtitle1' sx={{ fontWeight: 700, textAlign: 'center', fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}>
                                {el.name}
                              </Typography>
                              <Typography variant='body2' sx={{ opacity: 0.9 }}>
                                {teamPlayers?.total ?? 0} / {maxPlayers} Players
                              </Typography>
                              <Box sx={{ width: '100%', mt: 1 }}>
                                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', pt: 1 }}>
                                  <Typography variant='body2' sx={{ opacity: 0.8, fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>
                                    Total Balance
                                  </Typography>
                                  <Typography variant='h6' sx={{ fontWeight: 700, fontSize: { xs: '20px', sm: '24px', md: '30px' }, mb: 0.75 }}>
                                    {availableBalance + reserveBalance} L
                                  </Typography>
                                </Box>
                                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant='body2' sx={{ opacity: 0.8, fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>
                                    Max Bid
                                  </Typography>
                                  <Typography variant='h6' sx={{ fontWeight: 700, color: '#ee5a6f', fontSize: { xs: '18px', sm: '20px', md: '24px' } }}>
                                    {maxBidAmount} L
                                  </Typography>
                                </Box>
                                <Typography variant='caption' sx={{ opacity: 0.7, fontSize: '0.7rem', mt: 0.75, display: 'block' }}>
                                  Reserve: {reserveBalance} L
                                </Typography>
                              </Box>
                            </Box>
                          </TeamButton>
                        </Grid>
                      )
                    })}
                  </Grid>
                )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1, sm: 2 },
          pb: { xs: 'calc(8px + env(safe-area-inset-bottom, 0px))', sm: undefined },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 1.5, sm: 2, md: 3 },
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          zIndex: 10
        }}
      >
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Total: {playersData.length}</Typography>
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Remaining: {playersData.filter(p => !p.team).length}</Typography>
        <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Sold: {playersData.filter(p => !!p.team).length}</Typography>
        <Typography sx={{ fontWeight: 700, color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Unsold: {playersData.filter(p => p.type === 'Unsold').length}</Typography>
        {isValidAdmin && playersData.filter(p => p.type === 'Unsold').length > 0 && (
          <Button
            size='small'
            variant='outlined'
            onClick={() => socket?.emit('resetAllUnsoldPlayers', {})}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8rem' }
            }}
          >
            Reset all unsold
          </Button>
        )}
      </Box>

      <StyledDialog open={unSoldDialog} onClose={() => setunSoldDialog(false)}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600 }}>
          Are you want to unsold this player?
        </DialogTitle>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setunSoldDialog(false)} sx={{ borderRadius: '12px', textTransform: 'none' }}>No</Button>
          <StyledButton onClick={unSoldBid} autoFocus sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff' }}>
            Yes
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      <StyledDialog
        open={sellDialog}
        onClose={() => {
          setSellDialog(false)
          setSelectedTeamForSell(null)
        }}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600 }}>
          Sell Player to {selectedTeamForSell?.name}?
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            {selectedTeamForSell?.logo && (
              <Avatar
                src={`${process.env.API_BASE_URL}/team/${selectedTeamForSell.logo}`}
                alt={selectedTeamForSell.name}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '4px solid #667eea' }}
              />
            )}
            <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>
              Final Bid Amount: <strong style={{ color: '#667eea' }}>{sumOfBid(bidProgress)} Lakh</strong>
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary', mb: 2 }}>
              Are you sure you want to sell <strong>{currentPlayerBid?.name}</strong> to{' '}
              <strong>{selectedTeamForSell?.name}</strong> for <strong>{sumOfBid(bidProgress)} Lakh</strong>?
            </Typography>
            {selectedTeamForSell && (() => {
              const teamPlayers = noOfTeamPlayer(playersData, selectedTeamForSell)

              const startBid = auctionSettingData?.startBid || 1

              const reservePlayersNeeded =
                (auctionSettingData?.maxPlayersPerteam || 11) -
                (auctionSettingData?.reservePlayersPerTeam || 0) -
                (teamPlayers?.players || 0)
              const reserveBalance = reservePlayersNeeded * startBid
              const availableBalance = 100 - reserveBalance - (teamPlayers?.totalSpend || 0)
              const currentBidAmount = sumOfBid(bidProgress)
              const balanceAfterPurchase = availableBalance - currentBidAmount

              return (
                <Box sx={{ p: 2, borderRadius: '12px', background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
                  <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>Team Details:</Typography>
                  <Typography variant='body2'>Reserve Balance: <strong>{reserveBalance} L</strong></Typography>
                  <Typography variant='body2'>After Purchase: <strong>{balanceAfterPurchase} L</strong></Typography>
                </Box>
              )
            })()}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => { setSellDialog(false); setSelectedTeamForSell(null) }} sx={{ borderRadius: '12px', textTransform: 'none' }}>
            Cancel
          </Button>
          <StyledButton
            onClick={() => sellBid(selectedTeamForSell)}
            autoFocus
            disabled={!selectedTeamForSell}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              '&:disabled': { opacity: 0.5, color: '#ffffff' }
            }}
          >
            Confirm Sell
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {showSellSuccess && <SoldLottieFullScreen onComplete={handleNextPlayer} />}
    </Box>
  )
}

AuctionPage.getLayout = page => <UserLayout>{page}</UserLayout>

export default AuctionPage
