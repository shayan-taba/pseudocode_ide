// This is the home page.
// It defines the page title and uses a client side component.

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
