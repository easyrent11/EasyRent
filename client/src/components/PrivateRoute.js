import {useNavigate } from 'react-router-dom';
import useAuthentication from '../components/userAuthentication';

export default function PrivateRoute({ component: Component, ...rest }) {
  const { token } = useAuthentication();
  const navigate = useNavigate();

  if (!token) {
    navigate('/'); // Redirect to the login page
    return null; // Render nothing while navigating
  }

  return <Component {...rest} />;
};
