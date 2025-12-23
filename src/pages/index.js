// ** React and Socket.io Imports
import React, { forwardRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import IconButton from '@mui/material/IconButton'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'

import io from 'socket.io-client'
import axios from 'axios'
import Cropper from 'react-easy-crop'

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
    maxWidth: '1400px',
    maxHeight: '95vh',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
}))

const AuctionHeader = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  padding: theme.spacing(3),
  position: 'relative',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  color: '#fff',
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
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)'
  }
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
  padding: theme.spacing(3),
  minHeight: '200px',
  background: $isdisabled
    ? 'linear-gradient(135deg, #4d4d4d 0%, #3d3d3d 100%)'
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
  '& *[style*="color: #56CA00"]': {
    color: '#56CA00 !important'
  },
  '&:hover': {
    transform: $isdisabled ? 'none' : 'translateY(-4px) scale(1.02)',
    boxShadow: $isactive ? '0 12px 40px rgba(102, 126, 234, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.3)'
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
}))

const SkillBadge = styled(Box)(({ theme, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
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

// Utility functions for image cropping
const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

// Round crop for player photos
const getCroppedImgRound = async (imageSrc, pixelCrop) => {
  try {
    if (!pixelCrop || !pixelCrop.width || !pixelCrop.height) {
      throw new Error('Invalid crop data')
    }

    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    const size = 400
    canvas.width = size
    canvas.height = size

    ctx.save()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, size, size)

    ctx.restore()

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error('Canvas is empty'))

            return
          }
          const file = new File([blob], 'photo.png', { type: 'image/png' })
          resolve({ file, blob })
        },
        'image/png',
        0.92
      )
    })
  } catch (error) {
    console.error('Error in getCroppedImgRound:', error)
    throw error
  }
}

// Square crop for team logos
const getCroppedImgSquare = async (imageSrc, pixelCrop) => {
  try {
    if (!pixelCrop || !pixelCrop.width || !pixelCrop.height) {
      throw new Error('Invalid crop data')
    }

    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    const size = 400
    canvas.width = size
    canvas.height = size

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, size, size)

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
  const [playerCropDialogOpen, setPlayerCropDialogOpen] = useState(false)
  const [playerSelectedImage, setPlayerSelectedImage] = useState(null)
  const [playerCrop, setPlayerCrop] = useState({ x: 0, y: 0 })
  const [playerZoom, setPlayerZoom] = useState(1)
  const [playerCroppedAreaPixels, setPlayerCroppedAreaPixels] = useState(null)

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
        const response = await axios.get(`${process.env.API_BASE_URL}/api/v1/auction-setting`)
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
        setPlayersData(players)
        setAllTeams(team)
        setCurrentPlayerBid(currentPlayer)
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
    }

    return () => {
      // Cleanup when the component is unmounted
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

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

  const raiseBid = () => {
    // Just increment bid, no team selection
    socket.emit('raiseBid', {})
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
    setTeamCropDialogOpen(false)
    setTeamSelectedImage(null)
  }

  const handleTeamLogoChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select an image file', 'error')

        return
      }
      setTeamZoom(1)
      setTeamCrop({ x: 0, y: 0 })
      const reader = new FileReader()
      reader.onload = e => {
        setTeamSelectedImage(e.target.result)
        setTeamCropDialogOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const onTeamCropComplete = useCallback((_, croppedPixels) => {
    setTeamCroppedAreaPixels(croppedPixels)
  }, [])

  const handleTeamCrop = useCallback(async () => {
    if (!teamSelectedImage || !teamCroppedAreaPixels) {
      Swal.fire('Error', 'Please select an image and crop area', 'error')

      return
    }
    try {
      const { file, blob } = await getCroppedImgSquare(teamSelectedImage, teamCroppedAreaPixels)
      setTeamLogoFile(file)
      setTeamLogoPreview(URL.createObjectURL(blob))
      setTeamCropDialogOpen(false)
      setTeamSelectedImage(null)
    } catch (err) {
      console.error('Crop error:', err)
      Swal.fire('Error', err.message || 'Failed to crop image. Please try again.', 'error')
    }
  }, [teamSelectedImage, teamCroppedAreaPixels])

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
    setPlayerCropDialogOpen(false)
    setPlayerSelectedImage(null)
  }

  const handlePlayerPhotoChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select an image file', 'error')

        return
      }
      setPlayerZoom(1)
      setPlayerCrop({ x: 0, y: 0 })
      const reader = new FileReader()
      reader.onload = e => {
        setPlayerSelectedImage(e.target.result)
        setPlayerCropDialogOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const onPlayerCropComplete = useCallback((_, croppedPixels) => {
    setPlayerCroppedAreaPixels(croppedPixels)
  }, [])

  const handlePlayerCrop = useCallback(async () => {
    if (!playerSelectedImage || !playerCroppedAreaPixels) {
      Swal.fire('Error', 'Please select an image and crop area', 'error')

      return
    }
    try {
      const { file, blob } = await getCroppedImgRound(playerSelectedImage, playerCroppedAreaPixels)
      setPlayerPhotoFile(file)
      setPlayerPhotoPreview(URL.createObjectURL(blob))
      setPlayerCropDialogOpen(false)
      setPlayerSelectedImage(null)
    } catch (err) {
      console.error('Crop error:', err)
      Swal.fire('Error', err.message || 'Failed to crop image. Please try again.', 'error')
    }
  }, [playerSelectedImage, playerCroppedAreaPixels])

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

  const undoBid = () => {
    socket.emit('undoBid', {})
  }

  const sellBid = selectedTeam => {
    if (!selectedTeam) {
      Swal.fire('Error', 'Please select a team', 'error')

      return
    }

    // Store sold player info for congratulations screen
    setSoldPlayerInfo({
      player: currentPlayerBid,
      team: selectedTeam,
      price: sumOfBid(bidProgress)
    })

    socket.emit('sellBid', { team: selectedTeam })
    setShowSellSuccess(true)
  }

  const handleNextPlayer = () => {
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

  const router = useRouter()

  // Show loading state for public users
  if (!isLoggedIn && loadingUsers) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography>Loading...</Typography>
        </Grid>
      </Grid>
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
              <Typography sx={{ fontWeight: 700, mx: 2 }}>Unsold Players: {unsoldPlayers}</Typography>
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
      <AuctionDialog
        fullScreen
        open={!!currentPlayerBid}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
          }
        }}
      >
        <AuctionHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <IconButton
              onClick={() => setCurrentPlayerBid(null)}
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
            <Box sx={{ flex: 1, textAlign: 'center' }}>
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
                {currentPlayerBid?.name}
              </Typography>

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
                  {isValidAdmin && (
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

                  {/* Right side: Increase button */}
                  {isValidAdmin && (() => {
                    // Check if all teams are disabled when there are bids
                    let allTeamsDisabled = false
                    if (bidProgress.length > 0 && allTeams.length > 0) {
                      allTeamsDisabled = allTeams.every(el => {
                        let teamPlayers = noOfTeamPlayer(playersData, el)
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

                        // Max bid = available balance + startBid
                        // But if availableBalance is negative or 0, they can still bid startBid from reserve
                        const maxBidAmount = availableBalance > 0 ? availableBalance + startBid : startBid

                        return (
                          teamPlayers?.total == auctionSettingData?.maxPlayersPerteam ||
                          (availableBalance <= 0 && Number(currentBidAmount) > Number(startBid)) ||
                          (availableBalance > 0 && Number(currentBidAmount) > Number(maxBidAmount))
                        )
                      })
                    }

                    return (
                      <IconButton
                        onClick={() => raiseBid()}
                        disabled={(!bidProgress.length && !auctionSettingData?.startBid) || allTeamsDisabled}
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
                          },
                          '&:disabled': {
                            opacity: 0.5,
                            cursor: 'not-allowed'
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    )
                  })()}
                </Box>
              </BidDisplay>
            </Box>
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
            {/* Player Card */}
            <Grid item xs={12} md={5} lg={4}>
              <PlayerCard>
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  {currentPlayerBid?.photo ? (
                    <CardMedia
                      component='img'
                      image={`${process.env.API_BASE_URL}/player/${currentPlayerBid.photo}`}
                      alt={currentPlayerBid?.name}
                      sx={{
                        width: '100%',
                        height: '400px',
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

                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {currentPlayerBid?.batstyle && (
                      <Grid item xs={4}>
                        <SkillBadge active={currentPlayerBid?.batstyle}>
                          <Box component='span'>🏏</Box>
                          <Typography variant='body2' sx={{ fontWeight: 600, color: "#fff" }}>
                            {currentPlayerBid?.batstyle ? 'Batsman' : 'No'}
                          </Typography>
                        </SkillBadge>
                      </Grid>
                    )}
                    {currentPlayerBid?.bowlstyle && (
                      <Grid item xs={4}>
                        <SkillBadge active={currentPlayerBid?.bowlstyle}>
                          <Box component='span'>⚾</Box>
                          <Typography variant='body2' sx={{ fontWeight: 600, color: "#fff" }}>
                            {currentPlayerBid?.bowlstyle ? 'Bowler' : 'No'}
                          </Typography>
                        </SkillBadge>
                      </Grid>
                    )}
                    {currentPlayerBid?.wicketkeeper && (
                      <Grid item xs={4}>
                        <SkillBadge active={currentPlayerBid?.wicketkeeper}>
                          <Box component='span'>🧤</Box>
                          <Typography variant='body2' sx={{ fontWeight: 600, color: "#fff" }}>
                            {currentPlayerBid?.wicketkeeper ? 'WK' : 'No'}
                          </Typography>
                        </SkillBadge>
                      </Grid>
                    )}
                  </Grid>

                  {/* T-Shirt Info if available */}
                  {(currentPlayerBid?.tshirtName || currentPlayerBid?.tshirtSize || currentPlayerBid?.tshirtNumber) && (
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
                        T-Shirt Details
                      </Typography>
                      <Grid container spacing={1}>
                        {currentPlayerBid?.tshirtName && (
                          <Grid item xs={12}>
                            <Typography variant='body2'>
                              <strong>Name:</strong> {currentPlayerBid.tshirtName}
                            </Typography>
                          </Grid>
                        )}
                        {currentPlayerBid?.tshirtSize && (
                          <Grid item xs={6}>
                            <Typography variant='body2'>
                              <strong>Size:</strong> {currentPlayerBid.tshirtSize}
                            </Typography>
                          </Grid>
                        )}
                        {currentPlayerBid?.tshirtNumber && (
                          <Grid item xs={6}>
                            <Typography variant='body2'>
                              <strong>Number:</strong> {currentPlayerBid.tshirtNumber}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </PlayerCard>
            </Grid>

            {/* Bidding Section */}
            {isValidAdmin && (
              <Grid item xs={12} md={7} lg={8}>
                {/* Team Selection for Selling */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {bidProgress.length > 0 &&
                    (() => {
                      return (
                        <>
                          <Grid
                            container
                            spacing={2}
                            sx={{ p: 1 }}
                          >
                            {allTeams.map((el, inx) => {
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

                              // Max bid = available balance + startBid
                              // But if availableBalance is negative or 0, they can still bid startBid from reserve
                              const maxBidAmount = availableBalance > 0 ? availableBalance + startBid : startBid

                              const isDisabled = teamPlayers?.total == auctionSettingData?.maxPlayersPerteam ||
                                (availableBalance <= 0 && Number(currentBidAmount) > Number(startBid)) ||
                                (availableBalance > 0 && Number(currentBidAmount) > Number(maxBidAmount))

                              return (
                                <Grid item xs={6} sm={6} md={3} lg={3} key={inx}>
                                  <TeamButton
                                    $isactive={false}
                                    $isdisabled={isDisabled}
                                    disabled={isDisabled}
                                    onClick={() => {
                                      if (!isDisabled && bidProgress.length > 0) {
                                        setSelectedTeamForSell(el)
                                        setSellDialog(true)
                                      }
                                    }}
                                    fullWidth
                                  >
                                    <Box
                                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                                    >
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
                                          fontSize: { xs: '16px', md: '18px' },
                                          mb: 1
                                        }}
                                      >
                                        {el?.name}
                                      </Typography>
                                      <Typography variant='body2' sx={{ opacity: 0.9, fontSize: '0.85rem', mb: 1 }}>
                                        {reservePlayers} Fixed / {teamPlayers?.players} Players
                                      </Typography>
                                      <Box
                                        sx={{
                                          mt: 1,
                                          p: 1.5,
                                          borderRadius: '10px',
                                          background: 'rgba(255,255,255,0.1)',
                                          backdropFilter: 'blur(10px)',
                                          width: '100%'
                                        }}
                                      >
                                        <Typography
                                          variant='body2'
                                          sx={{ mb: 0.75, opacity: 0.8, fontSize: '0.75rem', display: 'block', fontWeight: 600 }}
                                        >
                                          Total Balance
                                        </Typography>
                                        <Typography
                                          variant='h6'
                                          sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.75 }}
                                        >
                                          {availableBalance + reserveBalance} L
                                        </Typography>
                                        <Box
                                          sx={{
                                            mt: 1,
                                            pt: 0.75,
                                            borderTop: '1px solid rgba(255,255,255,0.2)'
                                          }}
                                        >
                                          <Typography
                                            variant='body2'
                                            sx={{ opacity: 0.8, fontSize: '0.75rem', display: 'block', fontWeight: 600 }}
                                          >
                                            Max Bid
                                          </Typography>
                                          <Typography
                                            variant='h6'
                                            sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#56CA00' }}
                                          >
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
                        </>
                      )
                    })()}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {showAd && !isValidAdmin && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography variant='h6' sx={{ color: 'text.secondary' }}>
              Developed by
            </Typography>
            <a href='https://www.cdmi.in/' target='_blank' rel='noreferrer'>
              <CardMedia
                component='img'
                sx={{ width: '200px', maxWidth: '100%' }}
                image='/creative-logo-blue.svg'
                title='Creative Design and Multimedia Institute'
              />
            </a>
          </Box>
        )}
        {/* <Dialog open={soldPlayerData} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
          <PlayerCard data={soldPlayerData} />
        </Dialog> */}
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
          if (!showSellSuccess) {
            setSellDialog(false)
            setSelectedTeamForSell(null)
          }
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='sm'
        fullWidth
      >
        {!showSellSuccess ? (
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
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                p: 3,
                borderRadius: '20px 20px 0 0',
                mb: 3,
                '& *': {
                  color: '#fff'
                }
              }}
            >
              <Typography variant='h4' sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                🎉 Congratulations! 🎉
              </Typography>
              <Typography variant='h6' sx={{ opacity: 0.9, color: '#fff' }}>
                Player Sold Successfully
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
              {/* Player Image */}
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={
                    soldPlayerInfo?.player?.photo
                      ? `${process.env.API_BASE_URL}/player/${soldPlayerInfo.player.photo}`
                      : null
                  }
                  alt={soldPlayerInfo?.player?.name}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid #667eea',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    mb: 1,
                    fontSize: '48px',
                    color: '#ffffff',
                    background: soldPlayerInfo?.player?.photo ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {!soldPlayerInfo?.player?.photo && soldPlayerInfo?.player?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant='h6' sx={{ fontWeight: 600, mt: 1 }}>
                  {soldPlayerInfo?.player?.name}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Player
                </Typography>
              </Box>

              {/* Arrow */}
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant='h3' sx={{ color: '#667eea' }}>
                  →
                </Typography>
              </Box>

              {/* Team Image */}
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={
                    soldPlayerInfo?.team?.logo
                      ? `${process.env.API_BASE_URL}/team/${soldPlayerInfo.team.logo}`
                      : null
                  }
                  alt={soldPlayerInfo?.team?.name}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid #56CA00',
                    boxShadow: '0 8px 24px rgba(86, 202, 0, 0.4)',
                    mb: 1,
                    fontSize: '48px',
                    color: '#ffffff',
                    background: soldPlayerInfo?.team?.logo ? 'transparent' : 'linear-gradient(135deg, #56CA00 0%, #6AD01F 100%)'
                  }}
                >
                  {!soldPlayerInfo?.team?.logo && soldPlayerInfo?.team?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant='h6' sx={{ fontWeight: 600, mt: 1 }}>
                  {soldPlayerInfo?.team?.name}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Team
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '2px solid rgba(102, 126, 234, 0.3)',
                mb: 3
              }}
            >
              <Typography variant='h5' sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
                {soldPlayerInfo?.price} Lakh
              </Typography>
              <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                Final Bid Amount
              </Typography>
            </Box>

            <StyledButton
              onClick={handleNextPlayer}
              autoFocus
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                px: 6,
                py: 1.5,
                fontSize: '18px',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              Next Player
            </StyledButton>
          </Box>
        )}
      </StyledDialog>

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
              onChange={e => setTeamFormData({ ...teamFormData, owner: e.target.value })}
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
              onChange={e => setPlayerFormData({ ...playerFormData, name: e.target.value })}
              required
            />
            <TextField
              label='Mobile'
              variant='outlined'
              fullWidth
              value={playerFormData.mobile}
              onChange={e => setPlayerFormData({ ...playerFormData, mobile: e.target.value })}
            />
            <Box>
              <input
                accept='image/*'
                style={{ display: 'none' }}
                id='player-photo-upload'
                type='file'
                onChange={handlePlayerPhotoChange}
              />
              <label htmlFor='player-photo-upload'>
                <Button variant='outlined' component='span' fullWidth sx={{ mb: 2 }}>
                  Upload Player Photo
                </Button>
              </label>
              {playerPhotoPreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <CardMedia
                    component='img'
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'contain'
                    }}
                    image={playerPhotoPreview}
                    alt='Player photo preview'
                  />
                </Box>
              )}
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
              onChange={e => setPlayerFormData({ ...playerFormData, tshirtName: e.target.value })}
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
              onChange={e => setPlayerFormData({ ...playerFormData, tshirtNumber: e.target.value })}
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

      {/* Team Logo Crop Dialog */}
      <Dialog
        open={teamCropDialogOpen}
        onClose={() => {
          setTeamCropDialogOpen(false)
          setTeamSelectedImage(null)
        }}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600
          }}
        >
          Crop Team Logo
        </DialogTitle>
        <IconButton
          onClick={() => {
            setTeamCropDialogOpen(false)
            setTeamSelectedImage(null)
          }}
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
          <CropContainer>
            {teamSelectedImage && (
              <Cropper
                image={teamSelectedImage}
                crop={teamCrop}
                zoom={teamZoom}
                aspect={1}
                cropShape='rect'
                showGrid={false}
                onCropChange={setTeamCrop}
                onZoomChange={setTeamZoom}
                onCropComplete={onTeamCropComplete}
              />
            )}
          </CropContainer>
          <Box sx={{ mt: 3 }}>
            <Typography variant='body2' sx={{ mb: 1, fontWeight: 600 }}>
              Zoom
            </Typography>
            <Slider min={1} max={3} step={0.1} value={teamZoom} onChange={(_, value) => setTeamZoom(value)} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setTeamCropDialogOpen(false)
              setTeamSelectedImage(null)
            }}
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTeamCrop}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
            variant='contained'
            startIcon={<CropIcon />}
          >
            Crop & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Player Photo Crop Dialog */}
      <Dialog
        open={playerCropDialogOpen}
        onClose={() => {
          setPlayerCropDialogOpen(false)
          setPlayerSelectedImage(null)
        }}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600
          }}
        >
          Crop Player Photo
        </DialogTitle>
        <IconButton
          onClick={() => {
            setPlayerCropDialogOpen(false)
            setPlayerSelectedImage(null)
          }}
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
          <CropContainer>
            {playerSelectedImage && (
              <Cropper
                image={playerSelectedImage}
                crop={playerCrop}
                zoom={playerZoom}
                aspect={1}
                cropShape='round'
                showGrid={false}
                onCropChange={setPlayerCrop}
                onZoomChange={setPlayerZoom}
                onCropComplete={onPlayerCropComplete}
              />
            )}
          </CropContainer>
          <Box sx={{ mt: 3 }}>
            <Typography variant='body2' sx={{ mb: 1, fontWeight: 600 }}>
              Zoom
            </Typography>
            <Slider min={1} max={3} step={0.1} value={playerZoom} onChange={(_, value) => setPlayerZoom(value)} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setPlayerCropDialogOpen(false)
              setPlayerSelectedImage(null)
            }}
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePlayerCrop}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
            variant='contained'
            startIcon={<CropIcon />}
          >
            Crop & Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Dashboard
