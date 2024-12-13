"use client";

import { useEffect, useState } from "react";
import IDE from "../../components/ide/ide";

export default function Challenge({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  interface Challenge {
    id: number;
    title: string;
    description: string;
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
    exampleSolution: string;
  }

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSolution, setIsSolution] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challenge, setChallenge] = useState<any | null>(null);

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
              setIsSolution(true);
            }
          }
        }

        // Fetch challenges from XML
        const response = await fetch("/challenge_questions.xml");
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");

        // Handle XML parsing errors
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
          console.error(
            "XML Parsing Error:",
            xmlDoc.getElementsByTagName("parsererror")[0].textContent
          );
          setIsLoading(false);
          return;
        }

        // Parse XML into challenges
        const challengeNodes = xmlDoc.getElementsByTagName("challenge");
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
            exampleSolution:
              node.getElementsByTagName("exampleSolution")[0]?.textContent ||
              "",
          };
        });

        setChallenges(loadedChallenges);

        // Find the challenge based on slug
        const challengeId = parseInt(slug);
        const foundChallenge = loadedChallenges.find(
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
  // Render the IDE

  return (
    <>
      {isPlayground &&
        {
          /*<IDE
          title="Playground"
          description="An IDE that runs pseudocode that has been converted to Python."
          tags={[]}
          difficulty=""
          testCases={[]}
          exampleCode=""
        />*/
        }}
      {!isPlayground && challenge && (
        <IDE
          id={challenge.id}
          title={challenge.title}
          description={challenge.description}
          tags={challenge.tags}
          difficulty={challenge.difficulty}
          testCases={challenge.testCases}
          exampleCode={challenge.exampleSolution} // Use exampleSolution as exampleCode
          testInputsTypes={challenge.dataTypes.inputs}
          outputType={challenge.dataTypes.outputType}
        />
      )}
    </>
  );
}
