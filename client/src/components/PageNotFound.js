import { Link } from "react-router-dom";
const ImageNotFound = require('../Assets/notfound.png');

export default function PageNotFound() {
  
  return (
    <article className="min-h-screen flex flex-col items-center  w-full  bg-no-repeat bg-center" style={{ backgroundImage: `url(${ImageNotFound})` }}>
      <h1 className="text-7xl font-bold mb-4">Oops!</h1>
      <h2 className="text-4xl mb-6">Error 404 - Page Not Found</h2>
      <p className="text-2xl text-gray-600 mb-6">The page you requested could not be found!</p>
      <div className="flex-grow">
        <Link
        to='/'
          className="text-[#CC6200] text-lg p-4 m-4"
        >
          Go back to home page
        </Link>
      </div>
    </article>
  );
}

