import React from 'react'
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material'

export default function PlayerCard({ data }) {
  const currentPlayerBid = data

  console.log('currentPlayerBid', currentPlayerBid)

  return (
    <Box
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '4px solid #00cc00',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#00cc00',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontFamily: "'Russo One'",
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '50px',
            lineHeight: '60px',
            letterSpacing: '0.05em',
            textTransform: 'capitalize',
            color: '#FFFFFF'
          }}
        >
          congratulation
        </Typography>
      </Box>

      {/* Body */}
      <Card>
        <CardMedia
          component='img'
          image={`${process.env.API_BASE_URL}/player/${currentPlayerBid?.photo}`} // Replace with your image URL
          alt='Player Image'
        />
      </Card>
      <Box sx={{ padding: 2 }}>
        {/* Player Details */}
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          Name: <span style={{ fontWeight: 'normal' }}>{currentPlayerBid?.name}</span>
        </Typography>
        <Typography variant='body1'>
          <strong>Batsman:</strong> {currentPlayerBid?.batstyle ? 'YES' : 'NO'}
        </Typography>
        <Typography variant='body1'>
          <strong>Bowler:</strong> {currentPlayerBid?.bowlstyle ? 'YES' : 'NO'}
        </Typography>
        <Typography variant='body1'>
          <strong>Wicket Keeper:</strong> {currentPlayerBid?.wicketkeeper ? 'YES' : 'NO'}
        </Typography>
        <Typography
          variant='body1'
          sx={{
            marginTop: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#00cc00'
          }}
        >
          Sold To Chennai Kings
        </Typography>
        <Typography
          variant='body1'
          sx={{
            fontWeight: 'bold',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: 2,
            backgroundColor: '#000',
            color: '#fff',
            padding: '4px 0',
            borderRadius: '4px'
          }}
        >
          Mo. {currentPlayerBid?.mobile}
        </Typography>
      </Box>

      {/* Sold Stamp */}
      <Box
        sx={{
          position: 'absolute',
          top: 160,
          right: 10,
          transform: 'rotate(-15deg)',
          border: '3px solid #00cc00',
          padding: '4px 8px',
          color: '#00cc00',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        SOLD
      </Box>
    </Box>
  )
}
