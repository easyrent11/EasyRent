import React from 'react';
import { FaStar } from "react-icons/fa";
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import { useScrollToTop } from './ScrollToTheTop';
export default function Rating() {
  useScrollToTop();
  return (

    <div className="flex items-center justify-center  w-full min-h-screen ">
      <article className="pb-8 pt-4 rounded-lg  bg-black  flex flex-col items-center rating-container  w-2/6">
        <div className="flex mb-4 items-center justify-center text-white text-4xl">
          <h1 className="m-2">Rate Us</h1>
          <SentimentVerySatisfiedIcon fontSize="large" style={{ color: 'yellow' }} />
        </div>
        <div className="flex items-center justify-center rating-stars p-4 w-1/2">
          <input
            type="radio"
            name="rating"
            id="star5"
            value="5"
            className="hidden"
          />
          <label
            htmlFor="star5"
            className="text-gray-400 m-2 hover:text-yellow-400"
          >
            <FaStar className="text-2xl" />
          </label>
          <input
            type="radio"
            name="rating"
            id="star4"
            value="4"
            className="hidden"
          />
          <label
            htmlFor="star4"
            className="text-gray-400  m-2 hover:text-yellow-400"
          >
            <FaStar className="text-2xl" />
          </label>
          <input
            type="radio"
            name="rating"
            id="star3"
            value="3"
            className="hidden"
          />
          <label
            htmlFor="star3"
            className="text-gray-400 m-2  hover:text-yellow-400"
          >
            <FaStar className="text-2xl" />
          </label>
          <input
            type="radio"
            name="rating"
            id="star2"
            value="2"
            className="hidden"
          />
          <label
            htmlFor="star2"
            className="text-gray-400 m-2 hover:text-yellow-400"
          >
            <FaStar className="text-2xl" />
          </label>
          <input
            type="radio"
            name="rating"
            id="star1"
            value="1"
            className="hidden"
          />
          <label
            htmlFor="star1"
            className="text-gray-400 hover:text-yellow-400"
          >
            <FaStar className="text-2xl" />
          </label>
        </div>
        <textarea
          id="rating-message"
          className="bg-white  border-none  text-black w-2/3 p-2 h-60 rounded-lg mt-2"
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
