// This creates a client-side handler in order to access the challenges in the public-static assets XML file.
// It gets the intended challenged from the slug and processes the challenge's data from the XML file.
// It then passes the data as params to the IDE.

"use client";

import { useEffect, useState } from "react";
import IDE from "./components/ide";

export default function ChallengeLoader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  interface Challenge {
    id: number;
    title: string;
    description: string;
    hint: string;
    tags: string[];
    dataTypes: {
      inputs: {
        name: string;
        type: string;
      }[];
      outputType: string;
    };
    difficulty: string;
    testCases: {
      inputs: string[];
      output: string;
    }[];
  }

  const [isLoading, setIsLoading] = useState<boolean>(true);
  //const [isSolution, setIsSolution] = useState<boolean>(false);
  //const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challenge, setChallenge] = useState<any | null>(null);
  //const [exampleSolutions, setExampleSolutions] = useState<any | null>(null);

  const [isPlayground, setIsPlayground] = useState(false);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const { slug } = await params;

        // Check if it's the playground
        if (slug[0] === "playground") {
          setIsPlayground(true);
          setIsLoading(false);
          return;
        } else {
          if (Number.isInteger(parseInt(slug))) {
            if (slug.length >= 2 && slug[1] == "solution") {
              //setIsSolution(true);
            }
          }
        }

        // Fetch challenges from XML (challenge questions)
        const challengeResponse = await fetch("/challenge_questions.xml");
        const challengeText = await challengeResponse.text();
        const challengeParser = new DOMParser();
        const challengeXmlDoc = challengeParser.parseFromString(
          challengeText,
          "application/xml"
        );

        // Handle XML parsing errors
        if (challengeXmlDoc.getElementsByTagName("parsererror").length > 0) {
          console.error(
            "XML Parsing Error:",
            challengeXmlDoc.getElementsByTagName("parsererror")[0].textContent
          );
          setIsLoading(false);
          return;
        }

        // Parse challenge questions into challenges
        const challengeNodes =
          challengeXmlDoc.getElementsByTagName("challenge");
        const loadedChallenges = Array.from(challengeNodes).map((node) => {
          const inputTypeNodes = node
            .getElementsByTagName("dataTypes")[0]
            ?.getElementsByTagName("inputType");
          const inputNameNodes = node
            .getElementsByTagName("dataTypes")[0]
            ?.getElementsByTagName("inputName");

          const inputs = Array.from(inputTypeNodes || []).map(
            (inputNode, index) => ({
              name: inputNameNodes?.[index]?.textContent || `Input${index + 1}`,
              type: inputNode?.textContent || "",
            })
          );

          return {
            id: parseInt(
              node.getElementsByTagName("id")[0]?.textContent || "0"
            ),
            title: node.getElementsByTagName("title")[0]?.textContent || "",
            description:
              node.getElementsByTagName("description")[0]?.textContent || "",
            hint: node.getElementsByTagName("hint")[0]?.textContent || "",
            tags: Array.from(node.getElementsByTagName("tag")).map(
              (tagNode) => tagNode.textContent || ""
            ),
            dataTypes: {
              inputs,
              outputType:
                node
                  .getElementsByTagName("dataTypes")[0]
                  ?.getElementsByTagName("outputType")[0]?.textContent || "",
            },
            difficulty:
              node.getElementsByTagName("difficulty")[0]?.textContent || "Easy",
            testCases: Array.from(node.getElementsByTagName("testCase")).map(
              (testCaseNode) => ({
                inputs: Array.from(
                  testCaseNode.getElementsByTagName("input")
                ).map((inputNode) => inputNode?.textContent || ""),
                output:
                  testCaseNode.getElementsByTagName("output")[0]?.textContent ||
                  "",
              })
            ),
          };
        });

        //setChallenges(loadedChallenges);

        // Now, fetch example solutions from another XML file
        const solutionResponse = await fetch("/example_solutions.xml");
        const solutionText = await solutionResponse.text();
        const solutionParser = new DOMParser();
        const solutionXmlDoc = solutionParser.parseFromString(
          solutionText,
          "application/xml"
        );

        if (solutionXmlDoc.getElementsByTagName("parsererror").length > 0) {
          console.error(
            "XML Parsing Error:",
            solutionXmlDoc.getElementsByTagName("parsererror")[0].textContent
          );
          setIsLoading(false);
          return;
        }

        // Parse the example solutions into a dictionary by id
        const solutionNodes = solutionXmlDoc.getElementsByTagName("solution");
        const loadedSolutions = Array.from(solutionNodes).reduce(
          (acc: any, node) => {
            const id = parseInt(
              node.getElementsByTagName("id")[0]?.textContent || "0"
            );
            const code =
              node.getElementsByTagName("code")[0]?.textContent || "";
            acc[id] = code; // Store by challenge ID
            return acc;
          },
          {}
        );

        //setExampleSolutions(loadedSolutions);

        // Now, associate example solution with challenges based on ID
        const updatedChallenges = loadedChallenges.map((ch) => ({
          ...ch,
          exampleSolution: loadedSolutions[ch.id] || "",
        }));

        //setChallenges(updatedChallenges);

        // Find the challenge based on slug
        const challengeId = parseInt(slug);
        const foundChallenge = updatedChallenges.find(
          (ch) => ch.id === challengeId
        );

        setChallenge(foundChallenge || null);
      } catch (error) {
        console.error("Error loading challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, [params]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="text-center text-3xl mt-20 text-gray-500">Loading...</div>
    );
  }

  // Render error state if challenge is not found
  if (!isPlayground && !challenge) {
    return (
      <div className="text-center text-3xl mt-20 text-red-300">
        Challenge not found
      </div>
    );
  }

  // Render the IDE with the updated challenge data
  return (
    <>
      {isPlayground &&
        // Placeholder for Playground IDE component
        /*<IDE
          title="Playground"
          description="An IDE that runs pseudocode that has been converted to Python."
          tags={[]}
          difficulty=""
          testCases={[]}
          exampleCode=""
        />*/
        null}
      {!isPlayground && challenge && (
        <IDE
          id={challenge.id}
          title={challenge.title}
          description={challenge.description}
          hint={challenge.hint}
          tags={challenge.tags}
          difficulty={challenge.difficulty}
          testCases={challenge.testCases}
          exampleCode={challenge.exampleSolution} // Use exampleSolution from the new XML file
          testInputsTypes={challenge.dataTypes.inputs}
          outputType={challenge.dataTypes.outputType}
        />
      )}
    </>
  );
}
