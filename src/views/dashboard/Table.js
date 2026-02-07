import { useEffect, useState } from 'react'
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
  Avatar
} from '@mui/material'
import Button from '@mui/material/Button'
import { styled, alpha } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import Image from 'next/image'
import Swal from 'sweetalert2'

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
        },
        '& .MuiTableCell-body': {
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
        }
      }
    }
  }
}))

const StyledEditButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '8px 20px',
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  marginRight: theme.spacing(1),
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    color: '#FFFFFF',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)'
  }
}))

const StyledDeleteButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '8px 20px',
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
  color: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(238, 90, 111, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)',
    color: '#FFFFFF',
    boxShadow: '0 6px 16px rgba(238, 90, 111, 0.4)',
    transform: 'translateY(-2px)'
  }
}))

const StyledUnsoldButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '8px 20px',
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  color: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    color: '#FFFFFF',
    boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
    transform: 'translateY(-2px)'
  }
}))

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2, 3)
  }
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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.primary.main, 0.04)
  }
}))

const StyledSaveButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    color: '#FFFFFF',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
  }
}))

const DashboardTable = ({ data, teams = [], getUsers = null, edit }) => {
  const router = useRouter()
  const [updateModel, setUpdateModel] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdmin = async () => {
    try {
      let checkToken = localStorage.getItem('authorization')
      if (!checkToken) {
        return setIsAdmin(false)
      }
      await axios.post(
        `${process.env.API_BASE_URL}/api/v1/admin/checkadmin`,
        {},
        {
          headers: {
            authorization: checkToken
          }
        }
      )
      setIsAdmin(true)
    } catch (error) {
      console.log(error)
      setIsAdmin(false)
      router.push('/')
    }
  }

  const openModelHandler = row => {
    setUpdateModel(row)
  }

  const updateHandler = async () => {
    try {
      if (updateModel && updateModel._id) {
        let checkToken = localStorage.getItem('authorization')
        await axios.patch(
          `${process.env.API_BASE_URL}/api/v1/user/${updateModel._id}`,
          {
            type: updateModel.type,
            team: updateModel?.team?._id || undefined,
            name: updateModel?.name,
            mobile: updateModel?.mobile,
            tshirtName: updateModel?.tshirtName || undefined,
            tshirtSize: updateModel?.tshirtSize || undefined,
            tshirtNumber: updateModel?.tshirtNumber || undefined,
            finalprice: updateModel?.finalprice !== undefined ? updateModel.finalprice : undefined
          },
          {
            headers: {
              authorization: checkToken
            }
          }
        )
        Swal.fire('Success', 'User updated successfully', 'success')
        getUsers()
        setUpdateModel(null)
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', error.response?.data?.message || 'Failed to update user', 'error')
    }
  }

  const deleteHandler = async (user) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${user.name}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      icon: 'warning'
    })

    if (isConfirmed) {
      try {
        let checkToken = localStorage.getItem('authorization')
        await axios.delete(
          `${process.env.API_BASE_URL}/api/v1/user/${user._id}`,
          {
            headers: {
              authorization: checkToken
            }
          }
        )
        Swal.fire('Deleted!', 'User has been deleted.', 'success')
        getUsers()
      } catch (error) {
        console.log(error)
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete user', 'error')
      }
    }
  }

  const unsoldHandler = async (user) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Mark as unsold?',
      text: `Remove ${user.name} from team and set price to 0?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, unsold',
      cancelButtonText: 'Cancel',
      icon: 'question'
    })

    if (isConfirmed) {
      try {
        const checkToken = localStorage.getItem('authorization')
        await axios.patch(
          `${process.env.API_BASE_URL}/api/v1/user/${user._id}`,
          { team: null, finalprice: 0 },
          { headers: { authorization: checkToken } }
        )
        Swal.fire('Done', 'Player marked as unsold.', 'success')
        getUsers()
      } catch (error) {
        console.log(error)
        Swal.fire('Error', error.response?.data?.message || 'Failed to mark player as unsold', 'error')
      }
    }
  }

  useEffect(() => {
    checkAdmin()
  }, [])

  return (
    <StyledCard>
      <StyledTableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>All Rounder</TableCell>
              <TableCell>Bat Style</TableCell>
              <TableCell>Bowl Style</TableCell>
              <TableCell>Wicket Keeper</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>T-Shirt Name</TableCell>
              <TableCell>T-Shirt Size</TableCell>
              <TableCell>T-Shirt Number</TableCell>
              {isAdmin && edit && <TableCell>Edit</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {row.photo ? (
                      <Avatar
                        alt={row.name}
                        src={row.isTempUser
                          ? `${process.env.API_BASE_URL}/temp-users/${row.photo}`
                          : `${process.env.API_BASE_URL}/player/${row.photo}`
                        }
                        sx={{
                          width: 100,
                          height: 100,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: '3px solid',
                          borderColor: 'divider'
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          backgroundColor: '#f0f0f0',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: '3px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant='caption' sx={{ color: '#999' }}>
                          No Photo
                        </Typography>
                      </Avatar>
                    )}
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem !important', ml: 2 }}>{row.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.team?.name || 'Not Selected Yet'}</TableCell>
                <TableCell>{row.mobile}</TableCell>
                <TableCell>{row.batstyle && row.bowlstyle ? 'Yes' : 'No'}</TableCell>
                <TableCell>{row.batstyle ? 'Yes' : 'No'}</TableCell>
                <TableCell>{row.bowlstyle ? 'Yes' : 'No'}</TableCell>
                <TableCell>{row.wicketkeeper ? 'Yes' : 'No'}</TableCell>
                {row.type == 'Captain' || row.type == 'IconPlayer' ? (
                  <TableCell>{row.type}</TableCell>
                ) : row.team ? (
                  <TableCell>{row.finalprice} Lakh</TableCell>
                ) : (
                  <TableCell>Not sold yet</TableCell>
                )}
                <TableCell>{row.tshirtName || '-'}</TableCell>
                <TableCell>{row.tshirtSize || '-'}</TableCell>
                <TableCell>{row.tshirtNumber || '-'}</TableCell>

                {isAdmin && edit && (
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <StyledEditButton variant='contained' onClick={() => openModelHandler(row)}>
                        Edit
                      </StyledEditButton>
                      {row.team && (
                        <StyledUnsoldButton variant='contained' onClick={() => unsoldHandler(row)}>
                          Unsold
                        </StyledUnsoldButton>
                      )}
                      <StyledDeleteButton variant='contained' onClick={() => deleteHandler(row)}>
                        Delete
                      </StyledDeleteButton>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <StyledDialog
        onClose={() => setUpdateModel(null)}
        aria-labelledby='customized-dialog-title'
        open={!!updateModel}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600
          }}
          id='customized-dialog-title'
        >
          Update User
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={() => setUpdateModel(null)}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <StyledTextField
            id='Name'
            label='Name'
            variant='outlined'
              fullWidth
            value={updateModel?.name || ''}
            onChange={e => setUpdateModel({ ...updateModel, name: e.target.value.toUpperCase().slice(0, 35) })}
            inputProps={{ maxLength: 35 }}
          />
            <StyledTextField
            id='Mobile'
            label='Mobile'
            variant='outlined'
              fullWidth
            value={updateModel?.mobile || ''}
            onChange={e => setUpdateModel({ ...updateModel, mobile: e.target.value })}
          />
            <StyledFormControl fullWidth size='large'>
            <InputLabel id='demo-select-small-label'>Team</InputLabel>
            <Select
              labelId='demo-select-small-label'
              id='demo-select-small'
              label='Team'
              value={updateModel?.team?._id || ''}
              onChange={e => setUpdateModel({ ...updateModel, team: { ...updateModel.team, _id: e.target.value } })}
            >
              <MenuItem value=''>
                <em>Please select one</em>
              </MenuItem>
              {teams.map((el, inx) => {
                return (
                  <MenuItem key={inx} value={el._id}>
                    {el.name}
                  </MenuItem>
                )
              })}
            </Select>
            </StyledFormControl>
            <StyledFormControl fullWidth size='large'>
            <InputLabel id='demo-select-small-label-type'>Type</InputLabel>
            <Select
              labelId='demo-select-small-label-type'
              id='demo-select-small'
              value={updateModel?.type || ''}
              label='Type'
              onChange={e => setUpdateModel({ ...updateModel, type: e.target.value })}
            >
              <MenuItem value=''>
                <em>Please select one</em>
              </MenuItem>
              <MenuItem value='Owner'>Owner</MenuItem>
              <MenuItem value='Captain'>Captain</MenuItem>
              <MenuItem value='IconPlayer'>Icon Player</MenuItem>
              <MenuItem value='Player'>Player</MenuItem>
            </Select>
            </StyledFormControl>
            <StyledTextField
              id='TShirtName'
              label='T-Shirt Name'
              variant='outlined'
              fullWidth
              value={updateModel?.tshirtName || ''}
              onChange={e => setUpdateModel({ ...updateModel, tshirtName: e.target.value.toUpperCase().slice(0, 35) })}
              inputProps={{ maxLength: 35 }}
            />
            <StyledTextField
              id='TShirtSize'
              label='T-Shirt Size'
              variant='outlined'
              fullWidth
              value={updateModel?.tshirtSize || ''}
              onChange={e => setUpdateModel({ ...updateModel, tshirtSize: e.target.value })}
            />
            <StyledTextField
              id='TShirtNumber'
              label='T-Shirt Number'
              variant='outlined'
              fullWidth
              value={updateModel?.tshirtNumber || ''}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 3)
                setUpdateModel({ ...updateModel, tshirtNumber: v })
              }}
              inputProps={{ inputMode: 'numeric', maxLength: 3 }}
            />
            <StyledTextField
              id='FinalPrice'
              label='Final Price (Lakh)'
              variant='outlined'
              fullWidth
              type='number'
              value={updateModel?.finalprice || ''}
              onChange={e => setUpdateModel({ ...updateModel, finalprice: e.target.value ? Number(e.target.value) : 0 })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUpdateModel(null)} sx={{ borderRadius: '12px', textTransform: 'none' }}>
            Cancel
          </Button>
          <StyledSaveButton autoFocus onClick={updateHandler}>
            Save changes
          </StyledSaveButton>
        </DialogActions>
      </StyledDialog>
    </StyledCard>
  )
}

export default DashboardTable
