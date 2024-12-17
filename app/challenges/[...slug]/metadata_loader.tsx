import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadataFunc = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;

  try {
    // Use fs to read the XML file from the server's file system
    const filePath = path.join(
      process.cwd(),
      "public",
      "challenge_questions.xml"
    );
    const challengeText = await fs.promises.readFile(filePath, "utf-8");

    // Parse XML using xml2js (returns a Promise)
    const parsedXml = await parseStringPromise(challengeText);

    // Extract challenge data from the parsed XML
    const challengeNodes = parsedXml.challenges.challenge || [];

    const loadedChallenges = challengeNodes.map((node: any) => ({
      id: parseInt(node.id[0], 10),
      title: node.title[0],
      description: node.description[0],
    }));

    const challengeId = parseInt(slug, 10);
    const foundChallenge = loadedChallenges.find(
      (ch: any) => ch.id === challengeId
    );

    return {
      title: `Challenge: ${
        foundChallenge ? foundChallenge.title : "Not Found"
      }`,
      description: `${
        foundChallenge ? foundChallenge.description : "No description available"
      }`,
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Error loading challenge",
      description: "There was an issue fetching the challenge data.",
    };
  }
};

export default function Challenge({ params }: Props) {
  return <div>Challenge content goes here...</div>;
}
