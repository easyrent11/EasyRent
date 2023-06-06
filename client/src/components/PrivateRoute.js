import {useNavigate } from 'react-router-dom';
import useAuthentication from '../components/userAuthentication';

export default function PrivateRoute({ component: Component,openLogin, ...rest }) {
  const { token } = useAuthentication();
  const navigate = useNavigate();


  if (!token) {
    navigate('/');
    openLogin();
    return null;
  }

  return <Component {...rest} />;
};
