import { use } from "react";
import challenges from "..//challenge_questions.json";
import IDE from "../../components/ide/ide";

export default function Challenge({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrap the `params` Promise
  const { slug } = use(params);

  let isPlayground = true;
  let challenge;

  if (slug != "playground") {
    isPlayground = false;

    const challengeId = parseInt(slug);

    // Find the corresponding challenge from the JSON
    challenge = challenges.find((ch) => ch.id === challengeId);

    // If the challenge is not found, show an error or a fallback
    if (!challenge) {
      return (
        <div className="text-center text-3xl mt-20 text-red-300">
          Challenge not found
        </div>
      );
    }
  }

  return (
    <>
      {isPlayground && (
        <IDE
          title="Playground"
          description="An IDE that runs pseudocode that has been converted to Python."
          tags={[]}
          difficulty=""
          testCases={[]}
        />
      )}
      {!isPlayground && (
        <IDE
          title={challenge!.title}
          description={challenge!.description}
          tags={challenge!.tags}
          difficulty={challenge!.difficulty}
          testCases={challenge!.testCases} // Pass test cases
        />
      )}
    </>
  );
}
