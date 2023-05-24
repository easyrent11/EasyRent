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
      question: "Do you offer airport pickup and drop-off services?",
      answer:
        "Yes, we provide airport pickup and drop-off services for your convenience. When making your reservation, select the airport as the pickup or drop-off location, and our staff will meet you there.",
    },
    {
      question: "What is the age requirement to rent a car?",
      answer:
        "The minimum age requirement to rent a car is 17 years old. However, additional fees may apply for drivers under 25 years old. Please refer to our Terms and Conditions for more details.",
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
