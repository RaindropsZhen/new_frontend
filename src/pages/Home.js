import React from 'react';
import MainLayout from '../layouts/MainLayout';
import ContactSection from '../components/contact';
import MainFeatures from '../components/MainFeatures';
import HomeHeader from '../components/HomeHeader';
import SubscriptionCard from '../components/Price';
import { useTranslation, initReactI18next } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <HomeHeader />
      <h2>{t('Welcome to React')}</h2>;      
      <MainFeatures />
      <SubscriptionCard />
      <h1>添加视频演示</h1>
      <ContactSection />
    </MainLayout>
  );
};

export default Home;
