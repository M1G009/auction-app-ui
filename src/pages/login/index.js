// ** React Imports
import { useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Alert from '@mui/material/Alert'
import { styled, alpha } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

import axios from 'axios'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Styled Components
const LoginWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(3),
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

const Card = styled(MuiCard)(({ theme }) => ({
  width: '100%',
  maxWidth: '450px',
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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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
  color: '#FFFFFF',
  boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    color: '#FFFFFF',
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.5)',
    transform: 'translateY(-2px)'
  },
  '&:active': {
    transform: 'translateY(0px)'
  }
}))

const TitleBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
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

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    error: ''
  })

  // ** Hook
  const router = useRouter()

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const submithandler = e => {
    e.preventDefault()

    // Clear any previous errors
    setValues({ ...values, error: '' })

    const formData = {
      email: e.target.elements.email.value,
      password: values.password
    }

    axios
      .post(`${process.env.API_BASE_URL}/api/v1/admin/login`, formData)
      .then(res => {
        localStorage.setItem('authorization', res.data.token)
        router.push('/')
      })
      .catch(err => {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login. Please try again.'
        setValues({ ...values, error: errorMessage })
        console.log(err)
      })
  }

  return (
    <LoginWrapper>
      <Card>
        <CardContent sx={{ padding: theme => `${theme.spacing(6, 5)} !important` }}>
          <TitleBox>
            <Typography className='title'>Auction Master</Typography>
            <Typography className='subtitle'>Welcome back! Please login to your account</Typography>
          </TitleBox>

          <form noValidate autoComplete='off' onSubmit={e => submithandler(e)}>
            {values.error && (
              <Alert
                severity='error'
                sx={{
                  marginBottom: 4,
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    alignItems: 'center'
                  }
                }}
              >
                {values.error}
              </Alert>
            )}

            <StyledTextField
              autoFocus
              fullWidth
              id='email'
              label='Email Address'
              type='email'
              sx={{ marginBottom: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailOutline sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                )
              }}
            />

            <StyledFormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                      sx={{ color: 'primary.main' }}
                    >
                      {values.showPassword ? <EyeOffOutline /> : <EyeOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </StyledFormControl>

            <StyledButton type='submit' fullWidth size='large' variant='contained'>
              Sign In
            </StyledButton>
          </form>
        </CardContent>
      </Card>
    </LoginWrapper>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
