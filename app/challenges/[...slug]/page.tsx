// This is the page invoked when users try to enter a specific challenge.
// This pages handles the challenge-id in the url-slug.

import ChallengeLoader from "./challenge_loader";
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: 'Pseudocode Challenge',
};

export default function Challenge({ params }: Props) {
  return <ChallengeLoader params={params} />;
}
