// ** React Imports
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import Swal from 'sweetalert2'

import axios from 'axios'
import io from 'socket.io-client'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden'
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08)
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12)
    }
  }
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

let socket

const Settings = () => {
  const router = useRouter()
  const [auctionSettingData, setAuctionSettingData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [bannerUploading, setBannerUploading] = useState(false)

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('authorization')

      const response = await axios.get(
        `${process.env.API_BASE_URL}/api/v1/auction-setting`,
        { headers: { authorization: token } }
      )
      if (response.data.data) {
        setAuctionSettingData(response.data.data)
      }
    } catch (error) {
      console.log(error)
      setError('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const checkAdminAndFetchSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem('authorization')
      if (!token) {
        router.push('/login')

        return
      }

      await axios.post(
        `${process.env.API_BASE_URL}/api/v1/admin/checkadmin`,
        {},
        { headers: { authorization: token } }
      )

      fetchSettings()
    } catch (error) {
      console.log(error)
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    checkAdminAndFetchSettings()

    const token = localStorage.getItem('authorization') || ''
    socket = io(process.env.API_BASE_URL, {
      transports: ['websocket'],
      query: {
        Authorization: token
      }
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [checkAdminAndFetchSettings])

  const handleBannerSelect = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }

    e.target.value = ''
  }

  const uploadBannerHandler = async () => {
    if (!bannerFile) return
    try {
      setBannerUploading(true)
      const token = localStorage.getItem('authorization')
      if (!token) {
        setError('Please login to upload banner')

        return
      }

      const formData = new FormData()
      formData.append('banner', bannerFile)

      const response = await axios.post(
        `${process.env.API_BASE_URL}/api/v1/auction-setting/banner`,
        formData,
        {
          headers: {
            authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data?.data) {
        setAuctionSettingData(response.data.data)
        setBannerFile(null)
        setBannerPreview(null)
        setSuccess('Banner uploaded successfully')
        if (socket) socket.emit('updateSetting', { data: response.data.data })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload banner')
    } finally {
      setBannerUploading(false)
    }
  }

  const updateSettinghandler = async (nextData) => {
    try {
      const token = localStorage.getItem('authorization')
      if (!token) {
        Swal.fire('Error', 'Please login to update settings', 'error')

        return
      }

      const dataToSave = nextData != null ? nextData : auctionSettingData

      await axios.patch(
        `${process.env.API_BASE_URL}/api/v1/auction-setting`,
        dataToSave,
        { headers: { authorization: token } }
      )

      if (nextData != null) {
        setAuctionSettingData(nextData)
      }

      if (socket) {
        socket.emit('updateSetting', { data: dataToSave })
      }

      setSuccess('Settings updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || 'Failed to update settings')
      setTimeout(() => setError(''), 3000)
    }
  }

  const resetPlayerAndAmountHandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will reset all players and amounts',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    })

    if (isConfirmed && socket) {
      socket.emit('resetPlayerAndAmountHandler', {})
      Swal.fire('Success', 'Players and amounts reset successfully', 'success')
    }
  }

  const resetCaptainHandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will reset all captains',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    })

    if (isConfirmed && socket) {
      socket.emit('resetCaptainHandler', {})
      Swal.fire('Success', 'Captains reset successfully', 'success')
    }
  }

  const resetIconPlayersHandler = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will reset all icon players',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning'
    })

    if (isConfirmed && socket) {
      socket.emit('resetIconPlayersHandler', {})
      Swal.fire('Success', 'Icon players reset successfully', 'success')
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading settings...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant='h4'
        sx={{
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        Auction Settings
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity='success' sx={{ mb: 3, borderRadius: '12px' }}>
          {success}
        </Alert>
      )}

      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                Auction Configuration
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                label='Auction Title'
                value={auctionSettingData?.auctionName || 'Cricket League'}
                variant='outlined'
                fullWidth
                onChange={e => setAuctionSettingData({ ...auctionSettingData, auctionName: e.target.value })}
                onBlur={updateSettinghandler}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                type='number'
                label='Max Players Per Team'
                value={auctionSettingData?.maxPlayersPerteam || 0}
                variant='outlined'
                fullWidth
                onChange={e => setAuctionSettingData({ ...auctionSettingData, maxPlayersPerteam: e.target.value })}
                onBlur={updateSettinghandler}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                type='number'
                label='Reserve Players Per Team'
                value={auctionSettingData?.reservePlayersPerTeam || 0}
                variant='outlined'
                fullWidth
                onChange={e => setAuctionSettingData({ ...auctionSettingData, reservePlayersPerTeam: e.target.value })}
                onBlur={updateSettinghandler}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                type='number'
                label='Starting Bid'
                value={auctionSettingData?.startBid || 1}
                variant='outlined'
                fullWidth
                onChange={e => setAuctionSettingData({ ...auctionSettingData, startBid: e.target.value })}
                onBlur={updateSettinghandler}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                Banner Image
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                {(auctionSettingData?.bannerImage || bannerPreview) && (
                  <Box
                    component='img'
                    src={
                      bannerPreview ||
                      `${process.env.API_BASE_URL}/banner/${auctionSettingData?.bannerImage}`
                    }
                    alt='Banner'
                    sx={{
                      maxHeight: 180,
                      width: '100%',
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant='outlined'
                    component='label'
                    sx={{ borderRadius: '12px', textTransform: 'none' }}
                  >
                    {auctionSettingData?.bannerImage && !bannerFile ? 'Change Banner' : 'Choose Image'}
                    <input
                      type='file'
                      hidden
                      accept='image/*'
                      onChange={handleBannerSelect}
                    />
                  </Button>
                  {bannerFile && (
                    <StyledButton
                      variant='contained'
                      onClick={uploadBannerHandler}
                      disabled={bannerUploading}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' }
                      }}
                    >
                      {bannerUploading ? 'Uploading...' : 'Upload Banner'}
                    </StyledButton>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                Registration Settings
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSettingData?.registrationActive || false}
                    onChange={e => {
                      const next = { ...auctionSettingData, registrationActive: e.target.checked }
                      setAuctionSettingData(next)
                      updateSettinghandler(next)
                    }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label='Registration Active'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                type='datetime-local'
                label='Registration Start Date'
                value={auctionSettingData?.registrationStartDate ? new Date(auctionSettingData.registrationStartDate).toISOString().slice(0, 16) : ''}
                variant='outlined'
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={e => {
                  const dateValue = e.target.value ? new Date(e.target.value).toISOString() : null
                  setAuctionSettingData({ ...auctionSettingData, registrationStartDate: dateValue })
                }}
                onBlur={updateSettinghandler}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                type='datetime-local'
                label='Registration End Date'
                value={auctionSettingData?.registrationEndDate ? new Date(auctionSettingData.registrationEndDate).toISOString().slice(0, 16) : ''}
                variant='outlined'
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={e => {
                  const dateValue = e.target.value ? new Date(e.target.value).toISOString() : null
                  setAuctionSettingData({ ...auctionSettingData, registrationEndDate: dateValue })
                }}
                onBlur={updateSettinghandler}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                Required Registration Fields
              </Typography>
              <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
                Select which fields are required during player registration
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSettingData?.registrationFieldsRequired?.photoRequired !== false}
                    onChange={e => {
                      const next = {
                        ...auctionSettingData,
                        registrationFieldsRequired: {
                          ...auctionSettingData?.registrationFieldsRequired,
                          photoRequired: e.target.checked
                        }
                      }
                      setAuctionSettingData(next)
                      updateSettinghandler(next)
                    }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label='Photo Required'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSettingData?.registrationFieldsRequired?.nameRequired !== false}
                    onChange={e => {
                      const next = {
                        ...auctionSettingData,
                        registrationFieldsRequired: {
                          ...auctionSettingData?.registrationFieldsRequired,
                          nameRequired: e.target.checked
                        }
                      }
                      setAuctionSettingData(next)
                      updateSettinghandler(next)
                    }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label='Name Required'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSettingData?.registrationFieldsRequired?.mobileRequired !== false}
                    onChange={e => {
                      const next = {
                        ...auctionSettingData,
                        registrationFieldsRequired: {
                          ...auctionSettingData?.registrationFieldsRequired,
                          mobileRequired: e.target.checked
                        }
                      }
                      setAuctionSettingData(next)
                      updateSettinghandler(next)
                    }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label='Mobile Number Required'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSettingData?.registrationFieldsRequired?.tshirtNameRequired || false}
                    onChange={e => {
                      const next = {
                        ...auctionSettingData,
                        registrationFieldsRequired: {
                          ...auctionSettingData?.registrationFieldsRequired,
                          tshirtNameRequired: e.target.checked
                        }
                      }
                      setAuctionSettingData(next)
                      updateSettinghandler(next)
                    }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label='T-Shirt Name Required'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSettingData?.registrationFieldsRequired?.tshirtSizeRequired || false}
                    onChange={e => {
                      const next = {
                        ...auctionSettingData,
                        registrationFieldsRequired: {
                          ...auctionSettingData?.registrationFieldsRequired,
                          tshirtSizeRequired: e.target.checked
                        }
                      }
                      setAuctionSettingData(next)
                      updateSettinghandler(next)
                    }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label='T-Shirt Size Required'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSettingData?.registrationFieldsRequired?.tshirtNumberRequired || false}
                    onChange={e => {
                      const next = {
                        ...auctionSettingData,
                        registrationFieldsRequired: {
                          ...auctionSettingData?.registrationFieldsRequired,
                          tshirtNumberRequired: e.target.checked
                        }
                      }
                      setAuctionSettingData(next)
                      updateSettinghandler(next)
                    }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label='T-Shirt Number Required'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSettingData?.registrationFieldsRequired?.skillsRequired || false}
                    onChange={e => {
                      const next = {
                        ...auctionSettingData,
                        registrationFieldsRequired: {
                          ...auctionSettingData?.registrationFieldsRequired,
                          skillsRequired: e.target.checked
                        }
                      }
                      setAuctionSettingData(next)
                      updateSettinghandler(next)
                    }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label='Skills Required (At least one skill must be selected)'
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: 'error.main' }}>
                Reset Actions
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledButton
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)'
                  }
                }}
                variant='contained'
                onClick={resetPlayerAndAmountHandler}
              >
                Reset Players and Amount
              </StyledButton>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledButton
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)'
                  }
                }}
                variant='contained'
                onClick={resetCaptainHandler}
              >
                Reset Captains
              </StyledButton>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledButton
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)'
                  }
                }}
                variant='contained'
                onClick={resetIconPlayersHandler}
              >
                Reset Icon Players
              </StyledButton>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </Box>
  )
}

Settings.getLayout = page => <UserLayout>{page}</UserLayout>

export default Settings

