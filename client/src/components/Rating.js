import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import { useScrollToTop } from './ScrollToTheTop';

export default function Rating() {
  useScrollToTop();
  const [rating, setRating] = useState(0);

  const handleStarClick = (e) => {
    const value = e.target.value;
    setRating(value);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <article className="pb-8 pt-4 rounded-lg bg-white flex flex-col items-center rating-container w-2/6">
        <div className="flex mb-4 items-center justify-center text-black text-4xl">
          <h1 className="m-2">Rate Us</h1>
          <SentimentVerySatisfiedIcon fontSize="large" style={{ color: 'yellow' }} />
        </div>
        <div className="flex items-center justify-center rating-stars p-4 w-1/2">
          {[5, 4, 3, 2, 1].map((value) => (
            <React.Fragment key={value}>
              <input
                type="radio"
                name="rating"
                id={`star${value}`}
                value={value}
                className="hidden"
                onClick={handleStarClick}
              />
              <label
                htmlFor={`star${value}`}
                className="text-gray-400 m-2 hover:text-yellow-400"
              >
                <FaStar className="text-2xl" />
              </label>
            </React.Fragment>
          ))}
        </div>
        <textarea
          id="rating-message"
          className="border-gray-300 border-2 text-black w-2/3 p-2 h-60 rounded-lg mt-2"
          placeholder="Leave something nice :)"
        ></textarea>
        <button
          id="submit-rating"
          className="bg-[#CC6200] w-1/4 mt-10 text-white rounded-lg px-4 py-2"
        >
          Submit
        </button>
      </article>
    </div>
  );
}
