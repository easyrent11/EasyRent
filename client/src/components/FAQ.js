import React from "react";
import { useState } from "react";
export default function FAQ (){
   const faqs = [
    {
      question: 'How do I make a reservation?',
      answer: 'To make a reservation, visit our website and click on the "Reserve Now" button. Fill in the required details, including the pickup location, dates, and vehicle type. Once you submit the form, your reservation will be confirmed.'
    },
    {
      question: 'What are the accepted payment methods?',
      answer: 'We accept various payment methods, including credit cards (Visa, Mastercard, American Express), debit cards, and cash. Please note that a valid credit card is required for security deposit purposes.'
    },
    {
      question: 'Can I modify or cancel my reservation?',
      answer: 'Yes, you can modify or cancel your reservation. Please visit our website and go to the "My Reservations" section. Enter your reservation details, and you\'ll be able to make changes or cancel your booking.'
    },
    {
      question: 'Do you offer airport pickup and drop-off services?',
      answer: 'Yes, we provide airport pickup and drop-off services for your convenience. When making your reservation, select the airport as the pickup or drop-off location, and our staff will meet you there.'
    },
    {
      question: 'What is the age requirement to rent a car?',
      answer: 'The minimum age requirement to rent a car is 21 years old. However, additional fees may apply for drivers under 25 years old. Please refer to our Terms and Conditions for more details.'
    }
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
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              className={`bg-white shadow-lg rounded-lg p-6 ${
                index === expandedIndex ? "bg-[#D9D9D9]" : ""
              }`}
              key={index}
            >
              <button
                className={`text-lg font-semibold mb-4 ${
                  index === expandedIndex ? "text-black" : "text-black text-2xl"
                }`}
                onClick={() => handleAccordionToggle(index)}
              >
                {faq.question}
              </button>
              {expandedIndex === index && (
                <p className={`text-black text-2lg`}>{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
};




