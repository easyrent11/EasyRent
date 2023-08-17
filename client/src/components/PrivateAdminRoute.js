import {useNavigate} from 'react-router-dom';
import useAuthentication from './userAuthentication';

export default function PrivateAdminRoute({ component: Component,handleLogout,selectedUser, ...rest }) {
  const {isAdmin } = useAuthentication();
  const navigate = useNavigate();
  

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return <Component {...rest} />; 
};




