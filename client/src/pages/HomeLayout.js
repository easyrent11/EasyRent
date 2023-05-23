import React from 'react'
import FirstSection from "../components/FirstSection";
import SecondSection from "../components/SecondSection";
import SectionThree from '../components/SectionThree';
import RatingSection from '../components/RatingSection';
export default function HomeLayout() {
  return (
    <>
        <FirstSection/>
        <SecondSection/>
        <SectionThree/>
        <RatingSection/>
    </>
  )
}
