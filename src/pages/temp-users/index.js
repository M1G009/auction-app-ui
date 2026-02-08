// ** React Imports
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Card,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material'
import Image from 'next/image'
import { styled, alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import axios from 'axios'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden'
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '20px',
  '& .MuiTable-root': {
    '& .MuiTableHead-root': {
      '& .MuiTableRow-root': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '& .MuiTableCell-head': {
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }
      }
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          transform: 'scale(1.01)'
        }
      }
    }
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'none',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}))

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.primary.main, 0.04)
  }
}))

const TempUsers = () => {
  const router = useRouter()
  const [tempUsers, setTempUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const checkAdminAndFetch = useCallback(async () => {
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

      fetchTempUsers()
    } catch (error) {
      console.log(error)
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    checkAdminAndFetch()
  }, [checkAdminAndFetch])

  const fetchTempUsers = async () => {
    try {
      const token = localStorage.getItem('authorization')

      const response = await axios.get(
        `${process.env.API_BASE_URL}/api/v1/temp-user`,
        { headers: { authorization: token } }
      )
      setTempUsers(response.data.data || [])
    } catch (error) {
      console.log(error)

      setError('Failed to fetch temp users')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      name: user.name || '',
      mobile: user.mobile || '',
      wicketkeeper: user.wicketkeeper || false,
      batstyle: user.batstyle || false,
      bowlstyle: user.bowlstyle || false,
      type: user.type || 'Player',
      tshirtName: user.tshirtName || '',
      tshirtSize: user.tshirtSize || '',
      tshirtNumber: user.tshirtNumber || ''
    })
    setEditDialogOpen(true)
    setError('')
    setSuccess('')
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('authorization')
      await axios.patch(
        `${process.env.API_BASE_URL}/api/v1/temp-user/${selectedUser._id}`,
        formData,
        { headers: { authorization: token } }
      )
      setSuccess('User updated successfully')
      setEditDialogOpen(false)
      fetchTempUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user')
    }
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authorization')
      await axios.delete(
        `${process.env.API_BASE_URL}/api/v1/temp-user/${selectedUser._id}`,
        { headers: { authorization: token } }
      )
      setSuccess('User deleted successfully')
      setDeleteDialogOpen(false)
      fetchTempUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('authorization')
      await axios.post(
        `${process.env.API_BASE_URL}/api/v1/temp-user/${selectedUser._id}/approve`,
        {},
        { headers: { authorization: token } }
      )
      setSuccess('User approved and transferred to main users')
      setApproveDialogOpen(false)
      fetchTempUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve user')
    }
  }

  const handleChange = (field) => (event) => {
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    if (event.target.type !== 'checkbox') {
      if (field === 'name') value = value.toUpperCase().slice(0, 35)
      else if (field === 'tshirtName') value = value.toUpperCase().slice(0, 35)
      else if (field === 'tshirtNumber') value = value.replace(/\D/g, '').slice(0, 3)
    }
    setFormData({ ...formData, [field]: value })
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        Pending Registrations
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
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Batsman</TableCell>
                <TableCell>Bowler</TableCell>
                <TableCell>WK</TableCell>
                <TableCell>T-Shirt Name</TableCell>
                <TableCell>T-Shirt Size</TableCell>
                <TableCell>T-Shirt Number</TableCell>
                <TableCell>Registered At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tempUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} align='center'>
                    <Typography sx={{ py: 4 }}>No pending registrations</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tempUsers.map((user, index) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            height: 80,
                            width: 80,
                            position: "relative",
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {user.photo ? (
                            <Image
                              alt={user.name}
                              src={`${process.env.API_BASE_URL}/temp-users/${user.photo}`}
                              layout='fill'
                              objectFit='cover'
                            />
                          ) : (
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Typography variant='caption' sx={{ color: '#999' }}>
                                No Photo
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.mobile || '-'}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>{user.batstyle ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{user.bowlstyle ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{user.wicketkeeper ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{user.tshirtName || '-'}</TableCell>
                    <TableCell>{user.tshirtSize || '-'}</TableCell>
                    <TableCell>{user.tshirtNumber || '-'}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StyledButton
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={() => handleEdit(user)}
                        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      >
                        Edit
                      </StyledButton>
                      <StyledButton
                        variant='contained'
                        color='success'
                        size='small'
                        onClick={() => {
                          setSelectedUser(user)
                          setApproveDialogOpen(true)
                          setError('')
                        }}
                        sx={{ background: 'linear-gradient(135deg, #56CA00 0%, #6AD01F 100%)' }}
                        startIcon={<CheckCircleIcon />}
                      >
                        Approve
                      </StyledButton>
                      <StyledButton
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={() => {
                          setSelectedUser(user)
                          setDeleteDialogOpen(true)
                          setError('')
                        }}
                        startIcon={<DeleteIcon />}
                        sx={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' }}
                      >
                        Delete
                      </StyledButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledCard>

      {/* Edit Dialog */}
      <StyledDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600, '& *': { color: '#fff' } }}>
          Edit User
        </DialogTitle>
        <IconButton
          onClick={() => setEditDialogOpen(false)}
          sx={{ position: 'absolute', right: 12, top: 12, color: '#fff' }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <StyledTextField
              label='Name'
              fullWidth
              value={formData.name || ''}
              onChange={handleChange('name')}
              inputProps={{ maxLength: 35 }}
            />
            <StyledTextField
              label='Mobile'
              fullWidth
              value={formData.mobile || ''}
              onChange={handleChange('mobile')}
            />
            <StyledTextField
              label='T-Shirt Name'
              fullWidth
              value={formData.tshirtName || ''}
              onChange={handleChange('tshirtName')}
              inputProps={{ maxLength: 35 }}
            />
            <StyledTextField
              label='T-Shirt Size'
              fullWidth
              value={formData.tshirtSize || ''}
              onChange={handleChange('tshirtSize')}
            />
            <StyledTextField
              label='T-Shirt Number'
              fullWidth
              value={formData.tshirtNumber || ''}
              onChange={handleChange('tshirtNumber')}
              inputProps={{ inputMode: 'numeric', maxLength: 3 }}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type || 'Player'}
                label='Type'
                onChange={handleChange('type')}
              >
                <MenuItem value='Player'>Player</MenuItem>
                <MenuItem value='Captain'>Captain</MenuItem>
                <MenuItem value='IconPlayer'>Icon Player</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox checked={formData.batstyle || false} onChange={handleChange('batstyle')} />}
              label='Batsman'
            />
            <FormControlLabel
              control={<Checkbox checked={formData.bowlstyle || false} onChange={handleChange('bowlstyle')} />}
              label='Bowler'
            />
            <FormControlLabel
              control={<Checkbox checked={formData.wicketkeeper || false} onChange={handleChange('wicketkeeper')} />}
              label='Wicket Keeper'
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: '12px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' }
            }}
            variant='contained'
          >
            Update
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Delete Dialog */}
      <StyledDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', color: '#fff', fontWeight: 600, '& *': { color: '#fff' } }}>
          Delete User
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '12px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)' }
            }}
            variant='contained'
          >
            Delete
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Approve Dialog */}
      <StyledDialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #56CA00 0%, #6AD01F 100%)', color: '#fff', fontWeight: 600, '& *': { color: '#fff' } }}>
          Approve User
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>Are you sure you want to approve and transfer {selectedUser?.name} to the main users collection?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setApproveDialogOpen(false)} sx={{ borderRadius: '12px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #56CA00 0%, #6AD01F 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #6AD01F 0%, #56CA00 100%)' }
            }}
            variant='contained'
          >
            Approve
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  )
}

TempUsers.getLayout = page => <UserLayout>{page}</UserLayout>

export default TempUsers

