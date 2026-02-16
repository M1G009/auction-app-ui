// ** React and Socket.io Imports
import React, { forwardRef, useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'

import io from 'socket.io-client'
import axios from 'axios'
import Lottie from 'lottie-react'
import { jsPDF } from 'jspdf'

// ** MUI Imports
import {
  Alert,
  Button,
  Dialog,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  Typography,
  Slide,
  Box,
  Grid,
  styled,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Card,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Slider,
  Avatar
} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import MuiTab from '@mui/material/Tab'

import ReplayIcon from '@mui/icons-material/Replay'
import GavelIcon from '@mui/icons-material/Gavel'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CropIcon from '@mui/icons-material/Crop'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

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

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '15px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
  }
}))

const StyledTab = styled(MuiTab)(({ theme }) => ({
  borderRadius: '12px 12px 0 0',
  marginRight: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '15px',
  minHeight: '48px',
  transition: 'all 0.3s ease',
  '&.Mui-selected': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    '& .MuiTab-label': {
      color: '#fff'
    }
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1)
  }
}))

const StyledTeamCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)'
  },
  '& .MuiCardMedia-root': {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  }
}))

const StyledDialog = styled(BootstrapDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  }
}))

const CropContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  height: 420,
  backgroundColor: theme.palette.background.default,
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
}))

// Auction Dialog Styled Components
const AuctionDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    maxWidth: '100%',
    maxHeight: '95vh',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
}))

const AuctionHeader = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  padding: theme.spacing(0),
  position: 'relative',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0px 15px',
  minHeight: '160px',
  '& *': {
    color: '#fff'
  },
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
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: 'none',
  background: 'transparent',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease'
}))

const BidDisplay = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: theme.spacing(3, 4),
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  color: '#ffffff',
  '& *': {
    color: '#ffffff'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'pulse 2s ease-in-out infinite'
  }
}))

const TeamButton = styled(Button)(({ theme, $isactive, $isdisabled }) => ({
  borderRadius: '16px',
  padding: theme.spacing(1),
  minHeight: '200px',
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
  '& *': {
    color: $isactive || $isdisabled ? '#fff' : '#2d2d44'
  },
  '& *[style*="color: #ee5a6f"]': {
    color: '#ee5a6f !important'
  },
  '&:hover': {
    transform: $isdisabled ? 'none' : 'translateY(-4px) scale(1.02)',
    boxShadow: $isactive ? '0 12px 40px rgba(102, 126, 234, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.3)'
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    '& *': {
      color: '#fff'
    }
  }
}))

const SkillBadge = styled(Box)(({ theme, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: '0.5rem 1rem 0.5rem 0.5rem',
  borderRadius: '20px',
  background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.05)',
  color: active ? '#fff' : theme.palette.text.secondary,
  fontWeight: 600,
  fontSize: '0.875rem',
  boxShadow: active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
  ...(active && {
    '& *': {
      color: '#fff'
    }
  })
}))

// Helper function to compress/resize images before creating data URL
const compressImage = (file, maxWidth = 2000, maxHeight = 2000, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File is required'))

      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      // Validate that we have a valid result
      if (!e || !e.target || !e.target.result) {
        reject(new Error('Failed to read file data'))

        return
      }

      const imageDataUrl = e.target.result

      // Validate it's a data URL
      if (typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image')) {
        reject(new Error('Invalid image data format'))

        return
      }

      let img
      try {
        img = new Image()
      } catch (err) {
        reject(new Error('Failed to create image object: ' + (err?.message || String(err))))

        return
      }

      // Verify image object was created
      if (!img) {
        reject(new Error('Image object is undefined'))

        return
      }

      img.onload = () => {
        try {
          // Calculate new dimensions
          let width = img.width || img.naturalWidth || 0
          let height = img.height || img.naturalHeight || 0

          if (width === 0 || height === 0) {
            reject(new Error('Image has invalid dimensions'))

            return
          }

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width
              width = maxWidth
            } else {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }

          // Create canvas and resize
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Could not get canvas context'))

            return
          }

          canvas.width = width
          canvas.height = height

          ctx.drawImage(img, 0, 0, width, height)

          // Convert to blob then to data URL
          canvas.toBlob(
            blob => {
              if (!blob) {
                reject(new Error('Failed to compress image'))

                return
              }
              const reader2 = new FileReader()
              reader2.onload = e2 => {
                if (e2 && e2.target && e2.target.result) {
                  resolve(e2.target.result)
                } else {
                  reject(new Error('Failed to read compressed image data'))
                }
              }
              reader2.onerror = () => {
                reject(new Error('Failed to read compressed image'))
              }
              reader2.readAsDataURL(blob)
            },
            file.type || 'image/jpeg',
            quality
          )
        } catch (err) {
          reject(new Error('Error processing image: ' + (err?.message || String(err))))
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'))
      }

      // Set src after all handlers are set up
      try {
        img.src = imageDataUrl
      } catch (err) {
        reject(new Error('Failed to set image source: ' + (err?.message || String(err))))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    try {
      reader.readAsDataURL(file)
    } catch (err) {
      reject(new Error('Failed to start reading file: ' + (err?.message || String(err))))
    }
  })
}

const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

// Square crop for team logos
const getCroppedImgSquare = async (imageSrc, pixelCrop) => {
  try {
    if (!imageSrc) {
      throw new Error('Image source is required')
    }
    if (typeof imageSrc !== 'string') {
      throw new Error('Image source must be a string')
    }
    if (!pixelCrop || !pixelCrop.width || !pixelCrop.height) {
      throw new Error('Invalid crop data')
    }

    let image
    try {
      image = await createImage(imageSrc)
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && err.message ? err.message : err ? String(err) : 'Unknown error'
      throw new Error('Failed to load image: ' + errorMessage)
    }

    if (!image) {
      throw new Error('Image object is undefined')
    }

    // Verify image is loaded and has valid dimensions
    if (!image.complete) {
      throw new Error('Image is not fully loaded')
    }
    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      throw new Error('Image has invalid dimensions')
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    const size = 400
    canvas.width = size
    canvas.height = size

    // Validate pixelCrop values
    const cropX = Math.max(0, Math.floor(pixelCrop.x || 0))
    const cropY = Math.max(0, Math.floor(pixelCrop.y || 0))
    const cropWidth = Math.max(1, Math.floor(pixelCrop.width || 1))
    const cropHeight = Math.max(1, Math.floor(pixelCrop.height || 1))

    // Ensure crop doesn't exceed image dimensions
    const maxWidth = Math.min(cropWidth, image.naturalWidth - cropX)
    const maxHeight = Math.min(cropHeight, image.naturalHeight - cropY)

    if (maxWidth <= 0 || maxHeight <= 0) {
      throw new Error('Invalid crop area: exceeds image dimensions')
    }

    ctx.drawImage(image, cropX, cropY, maxWidth, maxHeight, 0, 0, size, size)

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error('Canvas is empty'))

            return
          }
          const file = new File([blob], 'logo.png', { type: 'image/png' })
          resolve({ file, blob })
        },
        'image/png',
        0.92
      )
    })
  } catch (error) {
    console.error('Error in getCroppedImgSquare:', error)
    throw error
  }
}

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

function SoldLottieFullScreen({ onComplete }) {
  const [animationData, setAnimationData] = useState(null)
  const [celebrationData, setCelebrationData] = useState(null)
  const soldLottieRef = useRef(null)
  const celebrationRef = useRef(null)

  useEffect(() => {
    fetch('/sold.json')
      .then(r => r.json())
      .then(setAnimationData)
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
    <Box>
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
        <Box sx={{ transform: 'translate3d(50px, -100px, 0px)' }}>
          {animationData && (
            <Lottie
              lottieRef={soldLottieRef}
              animationData={animationData}
              loop={false}
              onDataReady={() => soldLottieRef.current?.setSpeed(0.1)}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

let socket

function useKeyboardBidEffect({
  enabled,
  bidProgress,
  allTeams,
  playersData,
  auctionSettingData
}) {
  const currentBidTeam =
    bidProgress?.length > 0 && bidProgress[bidProgress.length - 1]?.teamId
      ? allTeams.find(t => t._id === bidProgress[bidProgress.length - 1].teamId) || null
      : null

  useEffect(() => {
    if (!enabled) return () => {}

    const raiseBid = team => {
      if (team) socket.emit('raiseBid', { team })
    }

    const undoBid = () => {
      socket.emit('undoBid', {})
    }

    const handleKeyUp = e => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) return
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
  }, [
    enabled,
    currentBidTeam,
    bidProgress,
    allTeams,
    playersData,
    auctionSettingData
  ])
}

const Dashboard = () => {
  // ** State
  const [currentType, setCurrentype] = useState('Player')
  const [playersData, setPlayersData] = useState([])
  const [isValidAdmin, setIsValidAdmin] = useState(false)
  const [unSoldDialog, setunSoldDialog] = useState(false)
  const [sellDialog, setSellDialog] = useState(false)
  const [currentPlayerBid, setCurrentPlayerBid] = useState(null)
  const [showAd, setShowAd] = useState(false)
  const [auctionSettingData, setAuctionSettingData] = useState({})
  const [soldPlayerData, setSoldPlayerData] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [tempUsers, setTempUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [bidProgress, setBidProgress] = useState([])

  const [allTeams, setAllTeams] = useState([])
  const [selectedTeamForSell, setSelectedTeamForSell] = useState(null)
  const [showSellSuccess, setShowSellSuccess] = useState(false)
  const [soldPlayerInfo, setSoldPlayerInfo] = useState(null)
  const [playerNumberInput, setPlayerNumberInput] = useState('')
  const [auctionDialogOpen, setAuctionDialogOpen] = useState(false)
  const [selectedPlayerIsSold, setSelectedPlayerIsSold] = useState(false)

  // Team management states
  const [teamDialog, setTeamDialog] = useState(false)
  const [teamEditMode, setTeamEditMode] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [teamFormData, setTeamFormData] = useState({ name: '', owner: '', logo: '' })
  const [teamLogoFile, setTeamLogoFile] = useState(null)
  const [teamLogoPreview, setTeamLogoPreview] = useState(null)
  const [teamCropDialogOpen, setTeamCropDialogOpen] = useState(false)
  const [teamSelectedImage, setTeamSelectedImage] = useState(null)
  const [teamCrop, setTeamCrop] = useState({ x: 0, y: 0 })
  const [teamZoom, setTeamZoom] = useState(1)
  const [teamCroppedAreaPixels, setTeamCroppedAreaPixels] = useState(null)

  // Player create state
  const [playerDialog, setPlayerDialog] = useState(false)
  const [playerPhotoFile, setPlayerPhotoFile] = useState(null)
  const [playerPhotoPreview, setPlayerPhotoPreview] = useState(null)

  const [playerFormData, setPlayerFormData] = useState({
    name: '',
    mobile: '',
    type: 'Player',
    wicketkeeper: false,
    batstyle: false,
    bowlstyle: false,
    tshirtName: '',
    tshirtSize: '',
    tshirtNumber: ''
  })

  const playerPhotoInputRef = useRef(null)
  const pendingSellRef = useRef(null)

  useEffect(() => {
    if (soldPlayerData) {
      setTimeout(() => {
        setSoldPlayerData(null)
      }, 3000)
    }
  }, [soldPlayerData])

  useEffect(() => {
    const token = localStorage.getItem('authorization') || ''
    const loggedIn = !!token
    setIsLoggedIn(loggedIn)

    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.API_BASE_URL}/api/v1/auction-setting?t=${Date.now()}`, {
          headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
        })
        if (response.data.data) {
          setAuctionSettingData(response.data.data)
        }
      } catch (error) {
        console.log('Failed to fetch settings:', error)
      }
    }
    fetchSettings()

    // Fetch users for public view
    if (!loggedIn) {
      fetchPublicUsers()
    }

    if (token) {
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
        const pending = pendingSellRef.current
        if (pending && currentPlayer === null && players?.length) {
          const soldPlayer = players.find(
            p => p._id === pending.playerId && p.team && (p.team._id === pending.teamId || p.team === pending.teamId)
          )
          if (soldPlayer) {
            setSoldPlayerInfo({
              player: soldPlayer,
              team: soldPlayer.team?.name ? soldPlayer.team : (team || []).find(t => t._id === pending.teamId) || soldPlayer.team,
              price: soldPlayer.finalprice
            })
            setShowSellSuccess(true)
            pendingSellRef.current = null
          }
        }
        setPlayersData(players)
        setAllTeams(team)
        setCurrentPlayerBid(prev => {
          if (currentPlayer !== null) return currentPlayer

          if (!prev || !players?.length) return prev

          const samePlayer = players.find(
            p => p._id === prev._id || String(p.playerNumber) === String(prev.playerNumber)
          )

          if (samePlayer) {
            setSelectedPlayerIsSold(!!samePlayer.team)

            return samePlayer
          }

          return prev
        })
        setBidProgress(bidProgress)
        if (auctionSetting) {
          setAuctionSettingData(auctionSetting)
        }
      })

      socket.on('newBid', ({ players, team, currentPlayer, bidProgress }) => {
        setPlayersData(players)
        setAllTeams(team)
        setCurrentPlayerBid(currentPlayer)
        setBidProgress(bidProgress)
        setSelectedPlayerIsSold(false)
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
        pendingSellRef.current = null
        alert(`${team.name} not have sufficient balance`)
      })

      socket.on('sellError', ({ message }) => {
        pendingSellRef.current = null
        if (message) alert(message)
      })

      socket.on('listcomplete', ({ }) => {
        setCurrentPlayerBid(null)
        setSelectedPlayerIsSold(false)
      })
    }

    return () => {
      // Cleanup when the component is unmounted
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

  const raiseBid = team => {
    if (team) socket.emit('raiseBid', { team })
  }

  const undoBid = () => {
    socket.emit('undoBid', {})
  }

  const currentBidTeam =
    bidProgress?.length > 0 && bidProgress[bidProgress.length - 1]?.teamId
      ? allTeams.find(t => t._id === bidProgress[bidProgress.length - 1].teamId) || null
      : null

  const fetchPublicUsers = async () => {
    setLoadingUsers(true)
    try {
      // Fetch regular users (public endpoint)
      const [usersResponse, teamsResponse] = await Promise.all([
        axios.get(`${process.env.API_BASE_URL}/api/v1/user`),
        axios.get(`${process.env.API_BASE_URL}/api/v1/team`)
      ])
      setAllUsers(usersResponse.data.data || [])
      setAllTeams(teamsResponse.data.data || [])

      // Fetch temp users (public endpoint) and mark them as temp users
      try {
        const tempResponse = await axios.get(`${process.env.API_BASE_URL}/api/v1/temp-user/public`)

        const tempUsersWithFlag = (tempResponse.data.data || []).map(user => ({
          ...user,
          isTempUser: true
        }))
        setTempUsers(tempUsersWithFlag)
      } catch (err) {
        // If public endpoint doesn't exist, just set empty array
        setTempUsers([])
      }
    } catch (error) {
      console.log('Failed to fetch users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleChange = (event, newValue) => {
    setCurrentype(newValue)
  }

  const bidStartHandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Open auction?',
      text: 'Enter player number or click Random to start',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'question'
    })

    if (isConfirmed) {
      setAuctionDialogOpen(true)
      setCurrentPlayerBid(null)
      setSelectedPlayerIsSold(false)
      setPlayerNumberInput('')
    }
  }

  const bidResumeHandler = () => {
    socket.emit('resumeBid', {})
  }

  const downloadRemainingPlayersPdf = async () => {
    const remaining = [...(playersData || [])]
      .filter(p => !p.team)
      .sort((a, b) => (a.playerNumber || 0) - (b.playerNumber || 0))
    if (!remaining.length) {
      Swal.fire('Info', 'No remaining players to list.', 'info')

      return
    }

    const getImageDataUrl = async url => {
      try {
        const res = await fetch(url, { mode: 'cors' })
        const blob = await res.blob()

        return await new Promise((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result)
          r.onerror = reject
          r.readAsDataURL(blob)
        })
      } catch {
        return null
      }
    }
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const margin = 10
    const cardW = (pageW - margin * 3) / 2
    const cardH = 42
    const pad = 4
    const imgW = 18
    const imgH = 18
    const textX = pad + imgW + 2
    const lineH = 5
    const cardsPerPage = 2 * Math.floor((pageH - margin * 2) / (cardH + margin))
    doc.setFontSize(10)
    const baseUrl = process.env.API_BASE_URL || ''
    for (let idx = 0; idx < remaining.length; idx++) {
      const player = remaining[idx]
      if (idx > 0 && idx % cardsPerPage === 0) doc.addPage()
      const cardOnPage = idx % cardsPerPage
      const col = cardOnPage % 2
      const row = Math.floor(cardOnPage / 2)
      const x = margin + col * (cardW + margin)
      const y = margin + row * (cardH + margin)
      doc.setDrawColor(200, 200, 200)
      doc.rect(x, y, cardW, cardH)
      if (player.photo && baseUrl) {
        const dataUrl = await getImageDataUrl(`${baseUrl}/player/${player.photo}`)
        if (dataUrl) {
          const format = dataUrl.indexOf('image/png') !== -1 ? 'PNG' : 'JPEG'
          doc.addImage(dataUrl, format, x + pad, y + pad, imgW, imgH)
        }
      }
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(`No: ${player.playerNumber ?? '-'}`, x + textX, y + pad + lineH)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Name: ${player.name || '-'}`, x + textX, y + pad + lineH * 2)
      doc.text(`Batsman: ${player.batstyle ? 'Yes' : 'No'}`, x + textX, y + pad + lineH * 3)
      doc.text(`Bowler: ${player.bowlstyle ? 'Yes' : 'No'}`, x + textX, y + pad + lineH * 4)
      doc.text(`Wicket Keeper: ${player.wicketkeeper ? 'Yes' : 'No'}`, x + textX, y + pad + lineH * 5)
    }
    doc.save('remaining-players.pdf')
  }

  const downloadAllTeamsPdf = () => {
    const teams = allTeams || []
    if (!teams.length) {
      Swal.fire('Info', 'No teams to list.', 'info')

      return
    }
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const margin = 10
    const colW = [12, 42, 28, 18, 18, 22, 22, 18]
    const rowH = 7
    const headerH = 8

    const getTeamPlayers = team =>
      (playersData || []).filter(
        p => p.team && (p.team._id === team._id || p.team === team._id)
      )
    let y = margin
    doc.setFontSize(10)
    teams.forEach((team, teamIdx) => {
      const typeOrder = ['Captain', 'IconPlayer', 'Player', 'Unsold']
      const teamPlayers = getTeamPlayers(team).sort((a, b) => {
        const ai = typeOrder.indexOf(a.type || 'Player')
        const bi = typeOrder.indexOf(b.type || 'Player')
        if (ai !== bi) return ai - bi
        return (a.playerNumber || 0) - (b.playerNumber || 0)
      })
      if (y > margin && y + headerH + rowH * (teamPlayers.length + 1) > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(team.name || `Team ${teamIdx + 1}`, margin, y)
      y += headerH
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const headers = ['No', 'Name', 'Mobile', 'Batsman', 'Bowler', 'Wicket Keeper', 'Type', 'Price']
      let x = margin
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(0.2)
      headers.forEach((h, i) => {
        doc.setFont('helvetica', 'bold')
        doc.rect(x, y - 5, colW[i], rowH)
        doc.text(h, x + 2, y)
        x += colW[i]
      })
      y += rowH
      teamPlayers.forEach((player, playerIdx) => {
        if (y + rowH > pageH - margin) {
          doc.addPage()
          y = margin
        }
        x = margin

        const cells = [
          String(playerIdx + 1),
          (player.name || '-').substring(0, 20),
          (player.mobile || '-').substring(0, 12),
          player.batstyle ? 'Yes' : 'No',
          player.bowlstyle ? 'Yes' : 'No',
          player.wicketkeeper ? 'Yes' : 'No',
          player.type || 'Player',
          player.finalprice != null ? String(player.finalprice) : '-'
        ]
        cells.forEach((cell, i) => {
          doc.rect(x, y - 5, colW[i], rowH)
          doc.text(cell, x + 2, y)
          x += colW[i]
        })
        y += rowH
      })
      y += rowH
    })
    doc.save('all-teams-players.pdf')
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

  // Refresh data function
  const refreshData = async () => {
    try {
      const token = localStorage.getItem('authorization') || ''

      const [playersResponse, teamsResponse] = await Promise.all([
        axios.get(`${process.env.API_BASE_URL}/api/v1/user`),
        axios.get(`${process.env.API_BASE_URL}/api/v1/team`)
      ])

      if (playersResponse.data?.data) {
        setPlayersData(playersResponse.data.data)
      }
      if (teamsResponse.data?.data) {
        setAllTeams(teamsResponse.data.data)
      }
    } catch (error) {
      console.log('Failed to refresh data:', error)
    }
  }

  // Team management handlers
  const openTeamDialog = (team = null) => {
    if (team) {
      setSelectedTeam(team)
      setTeamEditMode(true)
      setTeamFormData({ name: team.name || '', owner: team.owner || '', logo: team.logo || '' })
      setTeamLogoFile(null)
      setTeamLogoPreview(team.logo ? `${process.env.API_BASE_URL}/team/${team.logo}` : null)
    } else {
      setSelectedTeam(null)
      setTeamEditMode(false)
      setTeamFormData({ name: '', owner: '', logo: '' })
      setTeamLogoFile(null)
      setTeamLogoPreview(null)
    }
    setTeamDialog(true)
  }

  const closeTeamDialog = () => {
    setTeamDialog(false)
    setSelectedTeam(null)
    setTeamEditMode(false)
    setTeamFormData({ name: '', owner: '', logo: '' })
    setTeamLogoFile(null)
    setTeamLogoPreview(null)
  }

  const handleTeamLogoChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select an image file', 'error')

        return
      }

      // Check file size (warn if too large)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        Swal.fire('Warning', 'Image is very large. Please use a smaller image.', 'warning')
      }

      // Directly set the file and preview without cropping
      setTeamLogoFile(file)
      setTeamLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleTeamSave = async () => {
    try {
      const token = localStorage.getItem('authorization')

      if (!token) {
        Swal.fire('Error', 'Please login to save team', 'error')

        return
      }

      const formData = new FormData()
      formData.append('name', teamFormData.name)
      formData.append('owner', teamFormData.owner || '')

      if (teamLogoFile) {
        formData.append('logo', teamLogoFile)
      }

      if (teamEditMode && selectedTeam) {
        await axios.patch(`${process.env.API_BASE_URL}/api/v1/team/${selectedTeam._id}`, formData, {
          headers: {
            authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        })
        Swal.fire('Success', 'Team updated successfully', 'success')
      } else {
        await axios.post(`${process.env.API_BASE_URL}/api/v1/team`, formData, {
          headers: {
            authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        })
        Swal.fire('Success', 'Team created successfully', 'success')
      }

      refreshData()
      closeTeamDialog()
    } catch (error) {
      console.log(error)
      Swal.fire('Error', error.response?.data?.message || 'Failed to save team', 'error')
    }
  }

  const handleTeamDelete = async team => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${team.name}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      icon: 'warning'
    })

    if (isConfirmed) {
      try {
        const token = localStorage.getItem('authorization')
        await axios.delete(`${process.env.API_BASE_URL}/api/v1/team/${team._id}`, { headers: { authorization: token } })
        Swal.fire('Deleted!', 'Team has been deleted.', 'success')
        refreshData()
      } catch (error) {
        console.log(error)
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete team', 'error')
      }
    }
  }

  // Player create handlers
  const openPlayerDialog = () => {
    setPlayerFormData({
      name: '',
      mobile: '',
      type: currentType === 'Team' ? 'Player' : currentType,
      wicketkeeper: false,
      batstyle: false,
      bowlstyle: false,
      tshirtName: '',
      tshirtSize: '',
      tshirtNumber: ''
    })
    setPlayerPhotoFile(null)
    setPlayerPhotoPreview(null)
    setPlayerDialog(true)
  }

  const closePlayerDialog = () => {
    setPlayerDialog(false)
    setPlayerFormData({
      name: '',
      mobile: '',
      type: 'Player',
      wicketkeeper: false,
      batstyle: false,
      bowlstyle: false,
      tshirtName: '',
      tshirtSize: '',
      tshirtNumber: ''
    })
    setPlayerPhotoFile(null)
    setPlayerPhotoPreview(null)
    if (playerPhotoInputRef.current) playerPhotoInputRef.current.value = ''
  }

  const handlePlayerPhotoChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select an image file', 'error')
        e.target.value = ''

        return
      }
      setPlayerPhotoFile(file)
      setPlayerPhotoPreview(URL.createObjectURL(file))
    }
    e.target.value = ''
  }

  const handlePlayerCreate = async () => {
    try {
      const token = localStorage.getItem('authorization')

      if (!token) {
        Swal.fire('Error', 'Please login to create player', 'error')

        return
      }

      const formData = new FormData()
      formData.append('name', playerFormData.name)
      formData.append('mobile', playerFormData.mobile || '')
      formData.append('type', playerFormData.type)
      formData.append('wicketkeeper', playerFormData.wicketkeeper)
      formData.append('batstyle', playerFormData.batstyle)
      formData.append('bowlstyle', playerFormData.bowlstyle)
      formData.append('tshirtName', playerFormData.tshirtName || '')
      formData.append('tshirtSize', playerFormData.tshirtSize || '')
      formData.append('tshirtNumber', playerFormData.tshirtNumber || '')

      if (playerPhotoFile) {
        formData.append('photo', playerPhotoFile)
      }

      await axios.post(`${process.env.API_BASE_URL}/api/v1/user`, formData, {
        headers: {
          authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      })

      Swal.fire('Success', 'Player created successfully', 'success')
      refreshData()
      closePlayerDialog()
    } catch (error) {
      console.log(error)
      Swal.fire('Error', error.response?.data?.message || 'Failed to create player', 'error')
    }
  }

  const sellBid = selectedTeam => {
    if (!selectedTeam) {
      Swal.fire('Error', 'Please select a team', 'error')

      return
    }

    pendingSellRef.current = {
      playerId: currentPlayerBid?._id,
      teamId: selectedTeam._id || selectedTeam.id
    }
    socket.emit('sellBid', { team: selectedTeam })
    setSellDialog(false)
    setSelectedTeamForSell(null)
  }

  const handleNextPlayer = () => {
    pendingSellRef.current = null
    setShowSellSuccess(false)
    setSellDialog(false)
    setSelectedTeamForSell(null)
    setSoldPlayerInfo(null)
  }

  const unSoldBid = () => {
    socket.emit('unSoldBid', {})
    setSellDialog(false)
    setunSoldDialog(false)
  }

  // For public view, combine all users and temp users
  const allPublicUsers = isLoggedIn ? [] : [...allUsers, ...tempUsers]

  // Determine which data source to use
  const dataSource = isLoggedIn ? playersData : allPublicUsers

  let data =
    dataSource
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

  if (!isLoggedIn && loadingUsers) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography>Loading...</Typography>
        </Grid>
      </Grid>
    )
  }

  if (!isValidAdmin) {
    const formatDate = d => {
      if (!d) return '—'

      const date = new Date(d)

      return date.toLocaleDateString(undefined, { dateStyle: 'medium' })
    }

    const registrationActive = auctionSettingData?.registrationActive

    const bannerOnly = (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#000',
          boxSizing: 'border-box'
        }}
      >
        {auctionSettingData?.bannerImage ? (
          <Box
            component='img'
            src={`${process.env.API_BASE_URL}/banner/${auctionSettingData.bannerImage}`}
            alt='Banner'
            sx={{
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Typography color='text.secondary'>
              {auctionSettingData?.auctionName || 'Auction'} — Admin login required to view
            </Typography>
          </Box>
        )}
      </Box>
    )

    if (!registrationActive) {
      return bannerOnly
    }

    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        <AppBar
          position='static'
          sx={{
            flexShrink: 0,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <Toolbar
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              py: 1.5,
              justifyContent: 'space-between',
              minHeight: { xs: 56, sm: 64 }
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 700,
                color: '#fff',
                flex: { xs: '1 1 100%', sm: '0 0 auto' },
                order: { xs: 1, sm: 0 }
              }}
            >
              {auctionSettingData?.auctionName || 'Auction'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 3 },
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.875rem'
              }}
            >
              <Typography component='span' variant='body2' sx={{ color: 'inherit' }}>
                Reg start: {formatDate(auctionSettingData?.registrationStartDate)}
              </Typography>
              <Typography component='span' variant='body2' sx={{ color: 'inherit' }}>
                Reg end: {formatDate(auctionSettingData?.registrationEndDate)}
              </Typography>
              <Link href='/registration' passHref>
                <Button
                  component='a'
                  variant='contained'
                  size='small'
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      color: '#fff'
                    }
                  }}
                >
                  Register
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            backgroundColor: '#000'
          }}
        >
          {auctionSettingData?.bannerImage ? (
            <Box
              component='img'
              src={`${process.env.API_BASE_URL}/banner/${auctionSettingData.bannerImage}`}
              alt='Banner'
              sx={{
                width: '100%',
                height: '100%',
                display: 'block'
              }}
            />
          ) : (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
            >
              <Typography color='text.secondary'>
                {auctionSettingData?.auctionName || 'Auction'} — Admin login required to view
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography
          variant='h3'
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2
          }}
        >
          {auctionSettingData?.auctionName || 'Cricket League'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={currentType}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <StyledTab
              value='Team'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Teams</TabName>
                </Box>
              }
            />
            <StyledTab
              value='Captain'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Captain</TabName>
                </Box>
              }
            />
            <StyledTab
              value='IconPlayer'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Icon Players</TabName>
                </Box>
              }
            />
            <StyledTab
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
              <Typography sx={{ fontWeight: 700, mx: 2 }}>Remaining Players: {unsoldPlayers}</Typography>
            </Box>
            <Box>
              {unsoldPlayers ? (
                <>
                  <StyledButton
                    sx={{
                      mr: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#ffffff',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                      }
                    }}
                    variant='contained'
                    onClick={bidStartHandler}
                  >
                    Start Auction
                  </StyledButton>
                  <StyledButton
                    sx={{
                      mr: 2,
                      background: 'linear-gradient(135deg, #9C9FA4 0%, #8A8D93 100%)',
                      color: '#ffffff',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #8A8D93 0%, #9C9FA4 100%)'
                      }
                    }}
                    variant='contained'
                    onClick={bidResumeHandler}
                  >
                    Resume
                  </StyledButton>
                  <StyledButton
                    sx={{
                      mr: 2,
                      background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                      color: '#ffffff',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
                      }
                    }}
                    variant='contained'
                    onClick={downloadRemainingPlayersPdf}
                  >
                    Remaining Players PDF
                  </StyledButton>
                  <StyledButton
                    sx={{
                      mr: 2,
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      color: '#ffffff',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)'
                      }
                    }}
                    variant='contained'
                    onClick={downloadAllTeamsPdf}
                  >
                    Team Wise PDF
                  </StyledButton>
                </>
              ) : (
                ''
              )}
            </Box>
          </Box>
        )}
        {currentType !== 'Team' ? (
          <>
            {isValidAdmin && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <StyledButton
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={openPlayerDialog}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                    }
                  }}
                >
                  Add {currentType}
                </StyledButton>
              </Box>
            )}
            <Table data={data} teams={allTeams} getUsers={isLoggedIn ? refreshData : null} edit={isValidAdmin} />
          </>
        ) : (
          <>
            {isValidAdmin && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <StyledButton
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={() => openTeamDialog()}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                    }
                  }}
                >
                  Add Team
                </StyledButton>
              </Box>
            )}
            <Grid container spacing={3} mt={2}>
              {allTeams.map((el, inx) => {
                return (
                  <Grid item key={'test' + inx} xs={12} md={3} lg={3}>
                    <StyledTeamCard>
                      <CardMedia
                        component={'img'}
                        sx={{ width: 362, maxWidth: '100%', aspectRatio: 1, height: '100%' }}
                        image={`${process.env.API_BASE_URL}/team/${el?.logo}`}
                        title={el?.name}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant='h5'
                          component='div'
                          sx={{
                            color: '#804bdf',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          {inx + 1} - {el?.name}
                        </Typography>
                        <Typography gutterBottom variant='h6' component='div' sx={{ fontWeight: 500 }}>
                          <b>Owner:</b> {el?.owner}
                        </Typography>
                        {isValidAdmin && (
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              variant='outlined'
                              size='small'
                              startIcon={<EditIcon />}
                              onClick={() => openTeamDialog(el)}
                              sx={{ borderRadius: '8px', textTransform: 'none' }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant='outlined'
                              color='error'
                              size='small'
                              startIcon={<DeleteIcon />}
                              onClick={() => handleTeamDelete(el)}
                              sx={{ borderRadius: '8px', textTransform: 'none' }}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </StyledTeamCard>
                  </Grid>
                )
              })}
            </Grid>
          </>
        )}
      </Grid>
      {/* <SoldLottieFullScreen onComplete={handleNextPlayer} /> */}
      <AuctionDialog
        fullScreen
        open={auctionDialogOpen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
          }
        }}
      >
        <AuctionHeader>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              width: '100%',
              gap: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <IconButton
                onClick={() => {
                  setAuctionDialogOpen(false)
                  setCurrentPlayerBid(null)
                  setSelectedPlayerIsSold(false)
                  setPlayerNumberInput('')
                }}
                sx={{
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'rotate(90deg)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CloseIcon />
              </IconButton>
              {isValidAdmin &&
                (() => {
                  const maxPlayerNum = playersData.length
                    ? Math.max(1, ...playersData.map(p => p.playerNumber).filter(n => n != null && n !== '')) ||
                    playersData.length
                    : 1

                  const submitPlayerNumber = () => {
                    if (currentPlayerBid && bidProgress.length > 0) return
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
                    } else {
                      if (socket) {
                        socket.emit('selectPlayerByNumber', { playerNumber: clamped })
                        setPlayerNumberInput('')
                      }
                    }
                  }

                  return (
                    <TextField
                      size='small'
                      type='text'
                      inputMode='numeric'
                      placeholder='Player No.'
                      disabled={!!(currentPlayerBid && bidProgress.length > 0)}
                      value={playerNumberInput}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '')
                        if (raw === '') {
                          setPlayerNumberInput('')

                          return
                        }
                        const num = parseInt(raw, 10)
                        if (!isNaN(num)) {
                          const clamped = Math.min(maxPlayerNum, Math.max(1, num))
                          setPlayerNumberInput(String(clamped))
                        }
                      }}
                      onBlur={submitPlayerNumber}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          submitPlayerNumber()
                        }
                      }}
                      inputProps={{ style: { color: '#fff', width: 100 } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                      }}
                    />
                  )
                })()}
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
              {currentPlayerBid ? (
                <>
                  <Typography
                    variant='h3'
                    sx={{
                      fontFamily: 'Russo One',
                      fontWeight: 400,
                      fontSize: { xs: '28px', md: '42px' },
                      color: '#fff',
                      textShadow: '2px 4px 8px rgba(0, 0, 0, 0.3)',
                      mb: 1
                    }}
                  >
                    {currentPlayerBid?.playerNumber != null && currentPlayerBid?.playerNumber !== ''
                      ? `${currentPlayerBid.playerNumber} - ${currentPlayerBid?.name}`
                      : currentPlayerBid?.name}
                  </Typography>

                  {currentPlayerBid?.type !== 'Unsold' && (
                  <BidDisplay sx={{ maxWidth: '600px', mx: 'auto', mt: 2 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2
                      }}
                    >
                      {/* Left side: Decrease button or Mark as Unsold */}
                      {isValidAdmin && !selectedPlayerIsSold && (
                        <>
                          {bidProgress.length > 0 ? (
                            <IconButton
                              onClick={() => undoBid()}
                              sx={{
                                borderRadius: '12px',
                                width: 56,
                                height: 56,
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                color: '#ffffff',
                                '&:hover': {
                                  background: 'rgba(255, 255, 255, 0.3)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => setunSoldDialog(true)}
                              sx={{
                                borderRadius: '12px',
                                width: 56,
                                height: 56,
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                                color: '#ffffff',
                                boxShadow: '0 4px 16px rgba(238, 90, 111, 0.4)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              <CancelIcon />
                            </IconButton>
                          )}
                        </>
                      )}

                      {/* Center: Bid Amount */}
                      <Typography
                        variant='h2'
                        sx={{
                          fontFamily: 'Russo One',
                          fontSize: { xs: '36px', md: '56px' },
                          color: '#ffffff',
                          fontWeight: 700,
                          textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          flex: 1,
                          textAlign: 'center'
                        }}
                      >
                        {sumOfBid(bidProgress)} Lakh
                      </Typography>

                      {/* Right side: Sold button */}
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
                            minWidth: 56,
                            height: 56,
                            px: 2,
                            background: 'linear-gradient(135deg, #56CA00 0%, #6AD01F 100%)',
                            color: '#ffffff',
                            fontWeight: 700,
                            textTransform: 'none',
                            boxShadow: '0 4px 16px rgba(86, 202, 0, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #6AD01F 0%, #56CA00 100%)',
                              transform: 'translateY(-2px)'
                            },
                            '&:disabled': {
                              opacity: 0.5,
                              cursor: 'not-allowed'
                            }
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
                            minWidth: 56,
                            height: 56,
                            px: 2,
                            ml: 1,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: '#ffffff',
                            fontWeight: 700,
                            textTransform: 'none',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                              transform: 'translateY(-2px)'
                            }
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
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
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
                  px: 2,
                  py: 1.25,
                  fontWeight: 700,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Random
              </Button>
            )}
          </Box>
        </AuctionHeader>

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: 'calc(100vh - 180px)',
            height: '100%',
            overflow: 'auto'
          }}
        >
          <Grid container spacing={3} justifyContent='center' sx={{ height: '100%' }}>
            {currentPlayerBid && (
              <Grid item xs={12} md={4} lg={4}>
                <PlayerCard>
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    {currentPlayerBid?.photo ? (
                      <CardMedia
                        component='img'
                        image={`${process.env.API_BASE_URL}/player/${currentPlayerBid.photo}`}
                        alt={currentPlayerBid?.name}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '400px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          '& *': {
                            color: '#fff'
                          }
                        }}
                      >
                        <Typography variant='h2' sx={{ fontWeight: 700 }}>
                          {currentPlayerBid?.name?.charAt(0) || '?'}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}
                    >
                      {currentPlayerBid?.batstyle && (
                        <Box>
                          <SkillBadge active={currentPlayerBid?.batstyle}>
                            <Box component='span'>🏏</Box>
                            <Typography variant='body2' sx={{ fontWeight: 600, color: '#fff' }}>
                              {currentPlayerBid?.batstyle ? 'BATSMAN' : 'No'}
                            </Typography>
                          </SkillBadge>
                        </Box>
                      )}
                      {currentPlayerBid?.bowlstyle && (
                        <Box>
                          <SkillBadge active={currentPlayerBid?.bowlstyle}>
                            <Box component='span'>⚾</Box>
                            <Typography variant='body2' sx={{ fontWeight: 600, color: '#fff' }}>
                              {currentPlayerBid?.bowlstyle ? 'BOWLER' : 'No'}
                            </Typography>
                          </SkillBadge>
                        </Box>
                      )}
                      {currentPlayerBid?.wicketkeeper && (
                        <Box>
                          <SkillBadge active={currentPlayerBid?.wicketkeeper}>
                            <Box component='span'>🧤</Box>
                            <Typography variant='body2' sx={{ fontWeight: 600, color: '#fff' }}>
                              {currentPlayerBid?.wicketkeeper ? 'WICKET KEEPER' : 'No'}
                            </Typography>
                          </SkillBadge>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </PlayerCard>
              </Grid>
            )}

            {/* Bidding Section - teams info always visible, centered when no player */}
            {isValidAdmin && (
              <Grid
                item
                xs={12}
                md={currentPlayerBid ? 8 : 12}
                sx={!currentPlayerBid ? { display: 'flex', justifyContent: 'center', alignItems: 'flex-start' } : {}}
              >
                {/* Team Selection for Selling */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    ...(!currentPlayerBid && { maxWidth: 900, width: '100%', mx: 'auto' })
                  }}
                >
                  {currentPlayerBid?.type === 'Unsold' ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 300,
                        width: '100%',
                        p: 2
                      }}
                    >
                      <Box
                        component='img'
                        src='/unsold.png'
                        alt='Unsold'
                        sx={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                      />
                    </Box>
                  ) : (
                  <Grid container spacing={2} sx={{ p: 1 }} justifyContent='center' alignItems='center'>
                    {allTeams.map((el, inx) => {
                      const teamCount = allTeams.length
                      const gridSize = teamCount <= 4 ? 3 : teamCount <= 6 ? 4 : 3
                      let teamPlayers = noOfTeamPlayer(playersData, el)
                      let reservePlayers = teamPlayers?.captain + teamPlayers?.iconPlayer
                      const currentBidAmount = sumOfBid(bidProgress)
                      const startBid = auctionSettingData?.startBid || 1

                      // Calculate reserve players needed
                      const reservePlayersNeeded =
                        (auctionSettingData?.maxPlayersPerteam || 11) -
                        (auctionSettingData?.reservePlayersPerTeam || 0) -
                        (teamPlayers?.players || 0)

                      // Reserve balance = reserve players needed * startBid
                      const reserveBalance = reservePlayersNeeded * startBid

                      // Available balance = total purse (100) - reserve balance - sum of finalprice of teamPlayers
                      const availableBalance = 100 - reserveBalance - (teamPlayers?.totalSpend || 0)

                      const maxPlayers = auctionSettingData?.maxPlayersPerteam || 11
                      const teamFull = (teamPlayers?.total ?? 0) >= maxPlayers

                      const maxBidAmount = teamFull
                        ? 0
                        : (availableBalance > 0 ? availableBalance + startBid : 0)

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
                        <Grid item xs={12 / Math.min(teamCount, 4)} sm={gridSize} md={gridSize} lg={gridSize} key={inx}>
                          <TeamButton
                            $isactive={currentBidTeam?._id === el._id}
                            $isdisabled={isDisabled}
                            onClick={() => {
                              if (currentBidTeam?._id === el._id) return
                              if (isDisabled) return
                              raiseBid(el)
                            }}
                            fullWidth
                          >
                            <Box
                              sx={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                                width: '100%'
                              }}
                            >
                              {selectedPlayerIsSold &&
                                currentPlayerBid?.team &&
                                (el._id === currentPlayerBid.team._id || el._id === currentPlayerBid.team) && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      inset: 0,
                                      zIndex: 2,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      pointerEvents: 'none',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    <Box
                                      component='img'
                                      src='/sold.png'
                                      alt='Sold'
                                      sx={{
                                        maxWidth: '90%',
                                        maxHeight: '90%',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        opacity: 0.6
                                      }}
                                    />
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
                              {el?.logo && (
                                <Avatar
                                  src={`${process.env.API_BASE_URL}/team/${el.logo}`}
                                  alt={el.name}
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    border: '3px solid rgba(255,255,255,0.3)',
                                    mb: 1
                                  }}
                                />
                              )}
                              <Typography
                                variant='h6'
                                sx={{
                                  fontWeight: 700,
                                  fontSize: { xs: '16px', md: '26px' },
                                  mb: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: '2',
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: '1.5em',
                                  minHeight: '3em'
                                }}
                              >
                                {el?.name}
                              </Typography>
                              <Typography variant='body2' sx={{ opacity: 0.9, fontSize: '0.85rem', mb: 1 }}>
                                {reservePlayers + (teamPlayers?.players || 0)} /{' '}
                                {auctionSettingData?.maxPlayersPerteam || 11} Players
                              </Typography>
                              <Box
                                sx={{
                                  borderRadius: '10px',
                                  background: 'rgba(255,255,255,0.1)',
                                  backdropFilter: 'blur(10px)',
                                  width: '100%'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      mb: 0.75,
                                      opacity: 0.8,
                                      fontSize: '0.75rem',
                                      display: 'block',
                                      fontWeight: 600
                                    }}
                                  >
                                    Total Balance
                                  </Typography>
                                  <Typography variant='h6' sx={{ fontWeight: 700, fontSize: '30px', mb: 0.75 }}>
                                    {availableBalance + reserveBalance} L
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    borderTop: '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                  }}
                                >
                                  <Typography
                                    variant='body2'
                                    sx={{ opacity: 0.8, fontSize: '0.75rem', display: 'block', fontWeight: 600 }}
                                  >
                                    Max Bid
                                  </Typography>
                                  <Typography variant='h6' sx={{ fontWeight: 700, color: '#ee5a6f' }}>
                                    {maxBidAmount} L
                                  </Typography>
                                </Box>
                                <Typography
                                  variant='caption'
                                  sx={{ opacity: 0.7, fontSize: '0.7rem', mt: 0.75, display: 'block' }}
                                >
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
            )}
          </Grid>
        </Box>

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            py: 1.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            flexWrap: 'wrap',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
            zIndex: 10
          }}
        >
          <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
            Total: {playersData.length}
          </Typography>
          <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
            Remaining: {playersData.filter(p => !p.team).length}
          </Typography>
          <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
            Sold: {playersData.filter(p => !!p.team).length}
          </Typography>
          <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Unsold: {playersData.filter(p => p.type === 'Unsold').length}
          </Typography>
        </Box>
      </AuctionDialog>

      <StyledDialog
        open={unSoldDialog}
        onClose={() => setunSoldDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          id='alert-dialog-title'
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600,
            '& *': {
              color: '#fff'
            }
          }}
        >
          Are you want to unsold this player?
        </DialogTitle>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setunSoldDialog(false)} sx={{ borderRadius: '12px', textTransform: 'none' }}>
            No
          </Button>
          <StyledButton
            onClick={() => unSoldBid()}
            autoFocus
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
          >
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
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='sm'
        fullWidth
      >
        <>
          <DialogTitle
            id='alert-dialog-title'
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontWeight: 600,
              '& *': {
                color: '#fff'
              }
            }}
          >
            Sell Player to {selectedTeamForSell?.name}?
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              {selectedTeamForSell?.logo && (
                <Avatar
                  src={`${process.env.API_BASE_URL}/team/${selectedTeamForSell.logo}`}
                  alt={selectedTeamForSell.name}
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid #667eea',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
                  }}
                />
              )}
              <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>
                Final Bid Amount: <strong style={{ color: '#667eea' }}>{sumOfBid(bidProgress)} Lakh</strong>
              </Typography>
              <Typography variant='body1' sx={{ color: 'text.secondary', mb: 2 }}>
                Are you sure you want to sell <strong>{currentPlayerBid?.name}</strong> to{' '}
                <strong>{selectedTeamForSell?.name}</strong> for <strong>{sumOfBid(bidProgress)} Lakh</strong>?
              </Typography>
              {selectedTeamForSell &&
                (() => {
                  const teamPlayers = noOfTeamPlayer(playersData, selectedTeamForSell)
                  const startBid = auctionSettingData?.startBid || 1

                  // Calculate reserve players needed
                  const reservePlayersNeeded =
                    (auctionSettingData?.maxPlayersPerteam || 11) -
                    (auctionSettingData?.reservePlayersPerTeam || 0) -
                    (teamPlayers?.players || 0)

                  // Reserve balance = reserve players needed * startBid
                  const reserveBalance = reservePlayersNeeded * startBid

                  // Available balance = total purse (100) - reserve balance - sum of finalprice of teamPlayers
                  const availableBalance = 100 - reserveBalance - (teamPlayers?.totalSpend || 0)

                  const currentBidAmount = sumOfBid(bidProgress)
                  const balanceAfterPurchase = availableBalance - currentBidAmount

                  return (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                        Team Details:
                      </Typography>
                      <Typography variant='body2'>
                        Available Balance: <strong>{availableBalance} L</strong>
                      </Typography>
                      <Typography variant='body2'>
                        Reserve Balance: <strong>{reserveBalance} L</strong>
                      </Typography>
                      <Typography variant='body2'>
                        After Purchase: <strong>{balanceAfterPurchase} L</strong>
                      </Typography>
                    </Box>
                  )
                })()}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                setSellDialog(false)
                setSelectedTeamForSell(null)
              }}
              sx={{ borderRadius: '12px', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <StyledButton
              onClick={() => sellBid(selectedTeamForSell)}
              autoFocus
              disabled={!selectedTeamForSell}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                },
                '&:disabled': {
                  opacity: 0.5,
                  color: '#ffffff'
                }
              }}
            >
              Confirm Sell
            </StyledButton>
          </DialogActions>
        </>
      </StyledDialog>

      {showSellSuccess && <SoldLottieFullScreen onComplete={handleNextPlayer} />}

      {/* Team Management Dialog */}
      <StyledDialog
        open={teamDialog}
        onClose={closeTeamDialog}
        aria-labelledby='team-dialog-title'
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle
          id='team-dialog-title'
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600
          }}
        >
          {teamEditMode ? 'Edit Team' : 'Add Team'}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={closeTeamDialog}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: '#fff'
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label='Team Name'
              variant='outlined'
              fullWidth
              value={teamFormData.name}
              onChange={e => setTeamFormData({ ...teamFormData, name: e.target.value })}
              required
            />
            <TextField
              label='Owner Name'
              variant='outlined'
              fullWidth
              value={teamFormData.owner}
              onChange={e => setTeamFormData({ ...teamFormData, owner: e.target.value.toUpperCase().slice(0, 35) })}
              inputProps={{ maxLength: 35 }}
            />
            <Box>
              <input
                accept='image/*'
                style={{ display: 'none' }}
                id='team-logo-upload'
                type='file'
                onChange={handleTeamLogoChange}
              />
              <label htmlFor='team-logo-upload'>
                <Button variant='outlined' component='span' fullWidth sx={{ mb: 2 }}>
                  Upload Team Logo
                </Button>
              </label>
              {teamLogoPreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <CardMedia
                    component='img'
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'contain'
                    }}
                    image={teamLogoPreview}
                    alt='Team logo preview'
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeTeamDialog} sx={{ borderRadius: '12px', textTransform: 'none' }}>
            Cancel
          </Button>
          <StyledButton
            onClick={handleTeamSave}
            autoFocus
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
          >
            Save
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Player Create Dialog */}
      <StyledDialog
        open={playerDialog}
        onClose={closePlayerDialog}
        aria-labelledby='player-dialog-title'
        maxWidth='md'
        fullWidth
      >
        <DialogTitle
          id='player-dialog-title'
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600
          }}
        >
          Add {currentType === 'Team' ? 'Player' : currentType}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={closePlayerDialog}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: '#fff'
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label='Name'
              variant='outlined'
              fullWidth
              value={playerFormData.name}
              onChange={e => setPlayerFormData({ ...playerFormData, name: e.target.value.toUpperCase().slice(0, 35) })}
              inputProps={{ maxLength: 35 }}
              required
            />
            <TextField
              label='Mobile'
              variant='outlined'
              fullWidth
              value={playerFormData.mobile}
              onChange={e => setPlayerFormData({ ...playerFormData, mobile: e.target.value })}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {playerPhotoPreview ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={playerPhotoPreview}
                    sx={{
                      width: 150,
                      height: 150,
                      border: `3px solid ${alpha('#667eea', 0.3)}`,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'error.dark' }
                    }}
                    size='small'
                    onClick={() => {
                      setPlayerPhotoFile(null)
                      setPlayerPhotoPreview(null)
                      if (playerPhotoInputRef.current) playerPhotoInputRef.current.value = ''
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  onClick={() => playerPhotoInputRef.current?.click()}
                  sx={{
                    border: `2px dashed ${alpha('#667eea', 0.3)}`,
                    borderRadius: '12px',
                    padding: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: alpha('#667eea', 0.05)
                    }
                  }}
                >
                  <CameraAltIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant='body1' sx={{ fontWeight: 600, mb: 1 }}>
                    Upload Photo
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    Click to select or drag and drop
                  </Typography>
                </Box>
              )}
              <input
                ref={playerPhotoInputRef}
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={handlePlayerPhotoChange}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={playerFormData.type}
                label='Type'
                onChange={e => setPlayerFormData({ ...playerFormData, type: e.target.value })}
              >
                <MenuItem value='Player'>Player</MenuItem>
                <MenuItem value='Captain'>Captain</MenuItem>
                <MenuItem value='IconPlayer'>Icon Player</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={playerFormData.batstyle}
                    onChange={e => setPlayerFormData({ ...playerFormData, batstyle: e.target.checked })}
                  />
                }
                label='Batsman'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={playerFormData.bowlstyle}
                    onChange={e => setPlayerFormData({ ...playerFormData, bowlstyle: e.target.checked })}
                  />
                }
                label='Bowler'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={playerFormData.wicketkeeper}
                    onChange={e => setPlayerFormData({ ...playerFormData, wicketkeeper: e.target.checked })}
                  />
                }
                label='Wicket Keeper'
              />
            </Box>
            <TextField
              label='T-Shirt Name'
              variant='outlined'
              fullWidth
              value={playerFormData.tshirtName}
              onChange={e =>
                setPlayerFormData({ ...playerFormData, tshirtName: e.target.value.toUpperCase().slice(0, 35) })
              }
              inputProps={{ maxLength: 35 }}
            />
            <TextField
              label='T-Shirt Size'
              variant='outlined'
              fullWidth
              value={playerFormData.tshirtSize}
              onChange={e => setPlayerFormData({ ...playerFormData, tshirtSize: e.target.value })}
            />
            <TextField
              label='T-Shirt Number'
              variant='outlined'
              fullWidth
              value={playerFormData.tshirtNumber}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 3)
                setPlayerFormData({ ...playerFormData, tshirtNumber: v })
              }}
              inputProps={{ inputMode: 'numeric', maxLength: 3 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closePlayerDialog} sx={{ borderRadius: '12px', textTransform: 'none' }}>
            Cancel
          </Button>
          <StyledButton
            onClick={handlePlayerCreate}
            autoFocus
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
          >
            Create
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Grid>
  )
}

export default Dashboard
