
import ChallengeLoader from "./challenge_loader";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function Challenge({ params }: Props) {
  return <ChallengeLoader params={params} />;
}
