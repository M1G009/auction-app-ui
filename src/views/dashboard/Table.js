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
import { styled } from '@mui/material/styles'
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
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
      if ((updateModel && updateModel?.team?._id) || updateModel.type) {
        let checkToken = localStorage.getItem('authorization')
        await axios.patch(
          `${process.env.API_BASE_URL}/api/v1/user/${updateModel._id}`,
          {
            type: updateModel.type,
            team: updateModel?.team?._id || undefined,
            name: updateModel?.name,
            mobile: updateModel?.mobile
          },
          {
            headers: {
              authorization: checkToken
            }
          }
        )
        getUsers()
        setUpdateModel(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkAdmin()
  }, [])

  return (
    <Card>
      <TableContainer>
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
              {isAdmin && edit && <TableCell>Edit</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ height: 100, width: 100, position: "relative", maxHeight: "auto" }}>
                      <Image alt={row.name} src={`${process.env.API_BASE_URL}/player/${row.photo}`} layout='fill' />
                    </Box>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important', ml: 1 }}>{row.name}</Typography>
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

                {isAdmin && edit && (
                  <TableCell>
                    <Button variant='contained' color='error' onClick={() => openModelHandler(row)}>
                      Edit
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BootstrapDialog
        onClose={() => setUpdateModel(null)}
        aria-labelledby='customized-dialog-title'
        open={!!updateModel}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Update User
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={() => setUpdateModel(null)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <TextField
            id='Name'
            label='Name'
            variant='outlined'
            value={updateModel?.name || ''}
            onChange={e => setUpdateModel({ ...updateModel, name: e.target.value })}
          />
          <br />
          <br />
          <TextField
            id='Mobile'
            label='Mobile'
            variant='outlined'
            value={updateModel?.mobile || ''}
            onChange={e => setUpdateModel({ ...updateModel, mobile: e.target.value })}
          />
          <br />
          <br />
          <FormControl sx={{ m: 1, width: 500, maxWidth: '100%' }} size='large'>
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
          </FormControl>
          <br />
          <br />
          <FormControl sx={{ m: 1, width: 500, maxWidth: '100%' }} size='large'>
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
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={updateHandler}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Card>
  )
}

export default DashboardTable
