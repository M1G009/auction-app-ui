// ** React Imports
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

// ** MUI Imports
import axios from 'axios'

const Teams = () => {
  // ** State
  const [data, setData] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.API_BASE_URL}/api/v1/team`)
      .then(res => {
        if (res.data?.data && res.data?.data.length) {
          setData(res.data?.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <h1>Teams</h1>
      <Grid container spacing={3}>
        {data.map((el, inx) => {
          return (
            <Grid item key={inx} xs={12} md={3} lg={4}>
              <Card>
                {/* <CardMedia
                  component={'img'}
                  sx={{ width: '100%', maxWidth: '100%' }}
                  image={`${process.env.API_BASE_URL}/team/${el?.logo}`}
                  title={el?.name}
                /> */}
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div' sx={{ color: '#804bdf' }}>
                    <b>{el?.name}</b>
                  </Typography>
                  <Typography gutterBottom variant='h6' component='div'>
                    <b>Owner:</b> {el?.captain?.name}
                  </Typography>
                  <Typography gutterBottom variant='h6' component='div'>
                    <b>Captain:</b> {el?.owner?.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

export default Teams
