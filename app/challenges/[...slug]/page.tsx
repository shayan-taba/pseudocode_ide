import { Metadata } from "next";
import ChallengeLoader from "./challenge_loader";
import { generateMetadataFunc } from "./metadata_loader";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  // Directly pass the resolved params to generateMetadataFunc
  return await generateMetadataFunc({ params });
};

export default function Challenge({ params }: Props) {
  return <ChallengeLoader params={params} />;
}
