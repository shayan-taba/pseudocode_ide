import ChallengesPage from './challenges/page'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Psuedocode Challenge',
};

export default function Home() {

  return (
    <ChallengesPage/>
  );
}

