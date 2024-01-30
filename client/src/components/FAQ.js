import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useScrollToTop } from './ScrollToTheTop';

export default function FAQ() {
  useScrollToTop();
  const faqs = [
    {
      question: "How do i upload my cars for rental?",
      answer:
        "To upload your cars for rental you need to sign up and provide all the required information about your car then you can simply go to the upload car section and start filling your car details.",
    },
    {
      question: "What are the accepted payment methods?",
      answer:
        "There is no payment methods on the website we are here just to provide connection between the two ends, you can simply chat with the buyer/seller and agree on a way to pay in whatever suitable way for both of you",
    },
    {
      question: "Can I modify or cancel my rent request?",
      answer:
        "Yes, you can modify or cancel your rent request as long as you have not actually met with the renter and took the car already.",
    },
    {
      question: "How is the car key exchange facilitated between the renter and rentee?",
      answer: "At EasyRent, we act as a reliable intermediary for car rentals. The key exchange process is organized between the renter and rentee. When a reservation is confirmed, both parties will receive contact details to coordinate the meeting. Typically, the renter and rentee will meet in person at an agreed-upon location to exchange keys. This process is repeated when the car is returned. Our platform ensures a smooth booking experience while allowing for a personal and secure key handover.",
    },
  ];
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionToggle = (index) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <div className="min-h-screen container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            className={` bg-white shadow-lg rounded-lg  p-6 ${
              index === expandedIndex ? "bg-[#D9D9D9]" : ""
            }`}
            key={index}
          >
            <button
              className="flex items-center  w-full p-2 justify-between text-lg font-semibold mb-4"
              onClick={() => handleAccordionToggle(index)}
            >
              <span>{faq.question}</span>
              <div className="ml-auto">
                {index === expandedIndex ? (
                  <IoIosArrowUp size={24} />
                ) : (
                  <IoIosArrowDown size={24} />
                )}
              </div>
            </button>
            {expandedIndex === index && (
              <p className="font-bold text-[#B03A2E]">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
