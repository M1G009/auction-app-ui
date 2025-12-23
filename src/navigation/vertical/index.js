// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CogOutline from 'mdi-material-ui/CogOutline'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Players',
      icon: AccountCogOutline,
      path: '/players'
    },
    {
      title: 'Settings',
      icon: CogOutline,
      path: '/settings'
    },
    {
      title: 'Pending Registrations',
      icon: AccountCogOutline,
      path: '/temp-users'
    }
  ]
}

export default navigation
