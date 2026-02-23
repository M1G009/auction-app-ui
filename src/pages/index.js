// ** React and Socket.io Imports
import React, { forwardRef, useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'

import io from 'socket.io-client'
import axios from 'axios'

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

  const router = useRouter()

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
      router.push('/auction')
    }
  }

  const bidResumeHandler = () => {
    if (socket) socket.emit('resumeBid', {})
    router.push('/auction')
  }

  const downloadRemainingPlayersPdf = async () => {
    const remaining = [...(playersData || [])].filter(p => !p.team)
    if (!remaining.length) {
      Swal.fire('Info', 'No remaining players to list.', 'info')

      return
    }
    try {
      const res = await axios.get(`${process.env.API_BASE_URL}/api/v1/pdf/remaining-players`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'remaining-players.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      Swal.fire('Error', e.response?.data?.message || 'Failed to download PDF', 'error')
    }
  }

  const downloadAllTeamsPdf = () => {
    const teams = allTeams || []
    if (!teams.length) {
      Swal.fire('Info', 'No teams to list.', 'info')

      return
    }
    axios
      .get(`${process.env.API_BASE_URL}/api/v1/pdf/team-wise`, { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'all-teams-players.pdf')
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
      .catch(e => Swal.fire('Error', e.response?.data?.message || 'Failed to download PDF', 'error'))
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
              <Link href='/auction' passHref>
                <Button
                  component='a'
                  variant='contained'
                  size='small'
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #56CA00 0%, #6AD01F 100%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6AD01F 0%, #56CA00 100%)',
                      color: '#fff'
                    }
                  }}
                >
                  Auction
                </Button>
              </Link>
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
