import {useNavigate} from 'react-router-dom';
import useAuthentication from './userAuthentication';
import { notify } from '../HelperFunctions/Notify';

export default function PrivateRoute({ component: Component,handleLogout, ...rest }) {
  const { token, isAdmin } = useAuthentication();
  const navigate = useNavigate();
  

  if (!token || !isAdmin) {
    navigate('/');
    return null;
  }

  return <Component {...rest} />; // Render the provided element directly
};




