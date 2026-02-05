// ** React Imports
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Alert from '@mui/material/Alert'
import { styled, alpha } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slider from '@mui/material/Slider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Cropper from 'react-easy-crop'

import axios from 'axios'

// ** Icons
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CloseIcon from '@mui/icons-material/Close'
import CropIcon from '@mui/icons-material/Crop'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Styled Components
const RegistrationWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)',
    pointerEvents: 'none'
  }
}))

const RegistrationContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  position: 'relative',
  zIndex: 1
}))

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(26, 26, 46, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  position: 'relative',
  zIndex: 2
}))

const Card = styled(MuiCard)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  position: 'relative',
  zIndex: 1,
  borderRadius: '24px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  background: 'rgba(255, 255, 255, 0.95)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
  }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main
      }
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: theme.palette.primary.main
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.primary.main, 0.2)
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
      fontWeight: 600
    }
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.5)',
    transform: 'translateY(-2px)'
  },
  '&:active': {
    transform: 'translateY(0px)'
  },
  '&:hover': {
    color: '#fff'
  }
}))

const TitleBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  '& .title': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 700,
    fontSize: '2rem',
    marginBottom: theme.spacing(1),
    letterSpacing: '-0.5px'
  },
  '& .subtitle': {
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
    fontWeight: 400
  }
}))

const PhotoUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05)
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

const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const size = 400
  canvas.width = size
  canvas.height = size

  ctx.save()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.clip()

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  )

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
}

const PlayerRegistration = () => {
  // ** State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    wicketkeeper: false,
    batstyle: false,
    bowlstyle: false,
    type: 'Player',
    tshirtName: '',
    tshirtSize: '',
    tshirtCustomSize: '',
    tshirtNumber: '',
    photo: null
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [registrationActive, setRegistrationActive] = useState(false)
  const [registrationStartDate, setRegistrationStartDate] = useState(null)
  const [registrationEndDate, setRegistrationEndDate] = useState(null)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const [registrationFieldsRequired, setRegistrationFieldsRequired] = useState({
    photoRequired: true,
    nameRequired: true,
    mobileRequired: true,
    tshirtNameRequired: false,
    tshirtSizeRequired: false,
    tshirtNumberRequired: false,
    skillsRequired: false,
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [submittedData, setSubmittedData] = useState(null)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)

  const fileInputRef = useRef(null)

  // ** Hook
  const router = useRouter()

  useEffect(() => {
    checkRegistrationStatus()
  }, [])

  useEffect(() => {
    if (!checkingStatus && !registrationActive) {
      router.replace('/')
    }
  }, [checkingStatus, registrationActive, router])

  const checkRegistrationStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_BASE_URL}/api/v1/auction-setting/registration-status?t=${Date.now()}`,
        { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } }
      )
      setRegistrationActive(response.data.registrationActive)
      setRegistrationStartDate(response.data.registrationStartDate || null)
      setRegistrationEndDate(response.data.registrationEndDate || null)
      if (response.data.registrationFieldsRequired) {
        setRegistrationFieldsRequired(response.data.registrationFieldsRequired)
      }
    } catch (err) {
      setError('Failed to check registration status')
      setRegistrationActive(false)
    } finally {
      setCheckingStatus(false)
    }
  }

  const formatRegDate = (d) => {
    if (!d) return '—'

    return new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' })
  }

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    const updatedData = { ...formData, [field]: value }

    // If tshirtSize changes and it's not "Other", clear custom size
    if (field === 'tshirtSize' && value !== 'Other') {
      updatedData.tshirtCustomSize = ''
    }

    setFormData(updatedData)
    setError('')
    setSuccess('')
  }

  const handleFileSelect = event => {
    const file = event.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')

        return
      }
      setZoom(1)
      setCrop({ x: 0, y: 0 })
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        setCropDialogOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCrop = useCallback(async () => {
    if (!selectedImage || !croppedAreaPixels) return
    try {
      const { file, blob } = await getCroppedImg(selectedImage, croppedAreaPixels)
      setFormData({ ...formData, photo: file })
      setImagePreview(URL.createObjectURL(blob))
      setCropDialogOpen(false)
      setSelectedImage(null)
    } catch (err) {
      setError('Failed to crop image. Please try again.')
    }
  }, [selectedImage, croppedAreaPixels, formData])

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleRegisterAnother = () => {
    setShowSuccessScreen(false)
    setSubmittedData(null)
    setError('')
    setSuccess('')
  }

  // Validate required fields
  const isFormValid = () => {
    if (registrationFieldsRequired.nameRequired && !formData.name.trim()) {
      return false
    }
    if (registrationFieldsRequired.mobileRequired && !formData.mobile.trim()) {
      return false
    }
    if (registrationFieldsRequired.photoRequired && !formData.photo) {
      return false
    }
    if (registrationFieldsRequired.tshirtNameRequired && !formData.tshirtName.trim()) {
      return false
    }
    if (registrationFieldsRequired.tshirtSizeRequired) {
      if (!formData.tshirtSize) {
        return false
      }
      if (formData.tshirtSize === 'Other' && !formData.tshirtCustomSize.trim()) {
        return false
      }
    }
    if (registrationFieldsRequired.tshirtNumberRequired && !formData.tshirtNumber.trim()) {
      return false
    }
    if (registrationFieldsRequired.skillsRequired && !formData.batstyle && !formData.bowlstyle && !formData.wicketkeeper) {
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isFormValid()) {
      setError('Please fill in all required fields')

      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('mobile', formData.mobile)
      submitData.append('wicketkeeper', formData.wicketkeeper)
      submitData.append('batstyle', formData.batstyle)
      submitData.append('bowlstyle', formData.bowlstyle)
      submitData.append('type', 'Player')
      submitData.append('tshirtName', formData.tshirtName || '')

      // Use custom size if "Other" is selected, otherwise use selected size
      const finalTshirtSize = formData.tshirtSize === 'Other' ? formData.tshirtCustomSize : formData.tshirtSize
      submitData.append('tshirtSize', finalTshirtSize || '')
      submitData.append('tshirtNumber', formData.tshirtNumber || '')

      if (formData.photo) {
        submitData.append('photo', formData.photo)
      }

      const response = await axios.post(
        `${process.env.API_BASE_URL}/api/v1/temp-user`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      // Store submitted data for success screen
      setSubmittedData({
        ...formData,
        photoPreview: imagePreview,
        finalTshirtSize: finalTshirtSize
      })

      // Show success screen
      setShowSuccessScreen(true)

      // Reset form
      setFormData({
        name: '',
        mobile: '',
        wicketkeeper: false,
        batstyle: false,
        bowlstyle: false,
        type: 'Player',
        tshirtName: '',
        tshirtSize: '',
        tshirtCustomSize: '',
        tshirtNumber: '',
        photo: null
      })
      setImagePreview(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingStatus) {
    return (
      <RegistrationWrapper>
        <HeaderAppBar position='static'>
          <Toolbar sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
            <Typography variant='h6' sx={{ fontWeight: 600, color: '#fff' }}>
              Player Registration
            </Typography>
            {registrationActive && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
                <Typography component='span' variant='body2' sx={{ color: 'inherit' }}>Reg start: {formatRegDate(registrationStartDate)}</Typography>
                <Typography component='span' variant='body2' sx={{ color: 'inherit' }}>Reg end: {formatRegDate(registrationEndDate)}</Typography>
              </Box>
            )}
          </Toolbar>
        </HeaderAppBar>
        <RegistrationContent>
          <Card>
            <CardContent sx={{ padding: theme => `${theme.spacing(6, 5)} !important`, textAlign: 'center' }}>
              <Typography>Checking registration status...</Typography>
            </CardContent>
          </Card>
        </RegistrationContent>
      </RegistrationWrapper>
    )
  }

  if (!registrationActive) {
    return null
  }

  if (showSuccessScreen && submittedData) {
    return (
      <RegistrationWrapper>
      <HeaderAppBar position='static'>
        <Toolbar sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ fontWeight: 600, color: '#fff' }}>
            Player Registration
          </Typography>
          {registrationActive && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
              <Typography component='span' variant='body2' sx={{ color: 'inherit' }}>Reg start: {formatRegDate(registrationStartDate)}</Typography>
              <Typography component='span' variant='body2' sx={{ color: 'inherit' }}>Reg end: {formatRegDate(registrationEndDate)}</Typography>
            </Box>
          )}
        </Toolbar>
      </HeaderAppBar>
        <RegistrationContent>
        <Card>
          <CardContent sx={{ padding: theme => `${theme.spacing(6, 5)} !important`, textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 80,
                  color: 'success.main',
                  mb: 2,
                  animation: 'pulse 0.6s ease-in-out'
                }}
              />
              <Typography
                className='title'
                sx={{
                  fontSize: '2.5rem',
                  mb: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Congratulations!
              </Typography>
              <Typography variant='h6' sx={{ color: 'text.secondary', mb: 4 }}>
                Registration Successful
              </Typography>
            </Box>

            <Box sx={{
              background: alpha('#667eea', 0.05),
              borderRadius: '16px',
              p: 3,
              mb: 4,
              textAlign: 'left'
            }}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                Registration Details
              </Typography>

              {submittedData.photoPreview && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Avatar
                    src={submittedData.photoPreview}
                    sx={{
                      width: 120,
                      height: 120,
                      border: `3px solid ${alpha('#667eea', 0.3)}`,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  />
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Full Name
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 600, mb: 2 }}>
                    {submittedData.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Mobile Number
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 600, mb: 2 }}>
                    {submittedData.mobile}
                  </Typography>
                </Grid>
                {submittedData.tshirtName && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                      T-Shirt Name
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 600, mb: 2 }}>
                      {submittedData.tshirtName}
                    </Typography>
                  </Grid>
                )}
                {submittedData.finalTshirtSize && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                      T-Shirt Size
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 600, mb: 2 }}>
                      {submittedData.finalTshirtSize}
                    </Typography>
                  </Grid>
                )}
                {submittedData.tshirtNumber && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                      T-Shirt Number
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 600, mb: 2 }}>
                      {submittedData.tshirtNumber}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    {submittedData.batstyle && (
                      <Box sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        background: alpha('#667eea', 0.1),
                        color: 'primary.main',
                        fontWeight: 600
                      }}>
                        Batsman
                      </Box>
                    )}
                    {submittedData.bowlstyle && (
                      <Box sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        background: alpha('#667eea', 0.1),
                        color: 'primary.main',
                        fontWeight: 600
                      }}>
                        Bowler
                      </Box>
                    )}
                    {submittedData.wicketkeeper && (
                      <Box sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        background: alpha('#667eea', 0.1),
                        color: 'primary.main',
                        fontWeight: 600
                      }}>
                        Wicket Keeper
                      </Box>
                    )}
                    {!submittedData.batstyle && !submittedData.bowlstyle && !submittedData.wicketkeeper && (
                      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        No specific skills selected
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <StyledButton
              variant='contained'
              size='large'
              fullWidth
              onClick={handleRegisterAnother}
              startIcon={<PersonAddIcon />}
              sx={{ maxWidth: '400px' }}
            >
              Register Another Player
            </StyledButton>
          </CardContent>
        </Card>
        </RegistrationContent>
      </RegistrationWrapper>
    )
  }

  return (
    <RegistrationWrapper>
      <HeaderAppBar position='static'>
        <Toolbar sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ fontWeight: 600, color: '#fff' }}>
            Player Registration
          </Typography>
          {registrationActive && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
              <Typography component='span' variant='body2' sx={{ color: 'inherit' }}>Reg start: {formatRegDate(registrationStartDate)}</Typography>
              <Typography component='span' variant='body2' sx={{ color: 'inherit' }}>Reg end: {formatRegDate(registrationEndDate)}</Typography>
            </Box>
          )}
        </Toolbar>
      </HeaderAppBar>
      <RegistrationContent>
      <Card>
        <CardContent sx={{ padding: theme => `${theme.spacing(6, 5)} !important` }}>
          <TitleBox>
            <Typography className='title'>Player Registration</Typography>
            <Typography className='subtitle'>Fill in your details to register for the tournament</Typography>
          </TitleBox>

          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            {error && (
              <Alert severity='error' sx={{ marginBottom: 4, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity='success' sx={{ marginBottom: 4, borderRadius: '12px' }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  {registrationFieldsRequired.photoRequired && !imagePreview && (
                    <Typography variant='caption' sx={{ color: 'error.main', mb: 1 }}>
                      Photo is required
                    </Typography>
                  )}
                  {imagePreview ? (
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <Avatar
                        src={imagePreview}
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
                          setImagePreview(null)
                          setFormData({ ...formData, photo: null })
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <PhotoUploadBox onClick={() => fileInputRef.current?.click()}>
                      <CameraAltIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant='body1' sx={{ fontWeight: 600, mb: 1 }}>
                        Upload Photo
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        Click to select or drag and drop
                      </Typography>
                    </PhotoUploadBox>
                  )}
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledTextField
                  required={registrationFieldsRequired.nameRequired}
                  fullWidth
                  id='name'
                  label='Full Name'
                  value={formData.name}
                  onChange={handleChange('name')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  required={registrationFieldsRequired.mobileRequired}
                  fullWidth
                  id='mobile'
                  label='Mobile Number'
                  value={formData.mobile}
                  onChange={handleChange('mobile')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  required={registrationFieldsRequired.tshirtNameRequired}
                  fullWidth
                  id='tshirtName'
                  label='T-Shirt Name'
                  value={formData.tshirtName}
                  onChange={handleChange('tshirtName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required={registrationFieldsRequired.tshirtSizeRequired}>
                  <InputLabel id='tshirt-size-label'>T-Shirt Size</InputLabel>
                  <Select
                    labelId='tshirt-size-label'
                    id='tshirtSize'
                    value={formData.tshirtSize}
                    label='T-Shirt Size'
                    onChange={handleChange('tshirtSize')}
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: alpha('#667eea', 0.04),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#667eea', 0.2)
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                        borderColor: '#667eea'
                      }
                    }}
                  >
                    <MenuItem value='S'>S</MenuItem>
                    <MenuItem value='M'>M</MenuItem>
                    <MenuItem value='L'>L</MenuItem>
                    <MenuItem value='XL'>XL</MenuItem>
                    <MenuItem value='XXL'>XXL</MenuItem>
                    <MenuItem value='XXXL'>XXXL</MenuItem>
                    <MenuItem value='4XL'>4XL</MenuItem>
                    <MenuItem value='Other'>Other</MenuItem>
                  </Select>
                </FormControl>
                {formData.tshirtSize === 'Other' && (
                  <StyledTextField
                    fullWidth
                    id='tshirtCustomSize'
                    label='Custom T-Shirt Size'
                    value={formData.tshirtCustomSize}
                    onChange={handleChange('tshirtCustomSize')}
                    sx={{ mt: 2 }}
                    required={registrationFieldsRequired.tshirtSizeRequired}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  required={registrationFieldsRequired.tshirtNumberRequired}
                  fullWidth
                  id='tshirtNumber'
                  label='T-Shirt Number'
                  value={formData.tshirtNumber}
                  onChange={handleChange('tshirtNumber')}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {registrationFieldsRequired.skillsRequired && (
                    <Typography variant='caption' sx={{ color: 'error.main' }}>
                      At least one skill is required
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.batstyle}
                          onChange={handleChange('batstyle')}
                          sx={{
                            '&.Mui-checked': {
                              color: '#667eea'
                            }
                          }}
                        />
                      }
                      label='Batsman'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.bowlstyle}
                          onChange={handleChange('bowlstyle')}
                          sx={{
                            '&.Mui-checked': {
                              color: '#667eea'
                            }
                          }}
                        />
                      }
                      label='Bowler'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.wicketkeeper}
                          onChange={handleChange('wicketkeeper')}
                          sx={{
                            '&.Mui-checked': {
                              color: '#667eea'
                            }
                          }}
                        />
                      }
                      label='Wicket Keeper'
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <StyledButton
                type='submit'
                fullWidth
                size='large'
                variant='contained'
                disabled={loading || !isFormValid()}
                sx={{ maxWidth: '400px', color: '#fff', '&:hover': { color: '#fff' } }}
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </StyledButton>
            </Box>
          </form>
        </CardContent>
      </Card>
      </RegistrationContent>
      <Dialog
        open={cropDialogOpen}
        onClose={() => {
          setCropDialogOpen(false)
          setSelectedImage(null)
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
            fontWeight: 600,
            '& *': {
              color: '#fff'
            }
          }}
        >
          Crop Image
        </DialogTitle>
        <IconButton
          onClick={() => {
            setCropDialogOpen(false)
            setSelectedImage(null)
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
            {selectedImage && (
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape='round'
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </CropContainer>
          <Box sx={{ mt: 3 }}>
            <Typography variant='body2' sx={{ mb: 1, fontWeight: 600 }}>
              Zoom
            </Typography>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(_, value) => setZoom(value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setCropDialogOpen(false)
              setSelectedImage(null)
            }}
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCrop}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    </RegistrationWrapper>
  )
}

PlayerRegistration.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default PlayerRegistration

