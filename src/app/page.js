import React from 'react'
import HeroSlider from '../components/HeroSlider'
import CategoryCards from '../components/CategoryCards'
import MyFavorite from '../components/home/MyFavorite'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <MyFavorite />
      <CategoryCards />
    </>
  )
} 