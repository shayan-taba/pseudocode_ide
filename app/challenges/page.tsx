"use client";

// This is the home/challenges page.
// It provides a searchable and filterable catalogue of all challenges and their associated metadata.

import { useState, useEffect } from "react";
import PointTally from "./point_tally";

import Link from "next/link";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  StarIcon,
  TrophyIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/nav_bar";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  difficulty: "SL" | "HL";
  type: string;
};

const getCompletionStatus = (id: number): { status: boolean } => {
  const storedData = localStorage.getItem(`challenge-${id}`);
  return storedData
    ? { status: JSON.parse(storedData).status }
    : { status: false };
};

const getPointsStatus = (id: number): { pointStatus: boolean } => {
  const storedData = localStorage.getItem(`challenge-${id}`);
  return storedData
    ? { pointStatus: JSON.parse(storedData).points }
    : { pointStatus: false };
};

// Reusable CustomSelect Component
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full border p-2 rounded bg-gray-800 text-gray-200 pr-8 appearance-none"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [search, setSearch] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [completionFilter, setCompletionFilter] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("title");

  useEffect(() => {
    setSortBy("title");
  }, []); // This is default when page loaded.

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("/challenge_questions.xml");
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");

        const challengeNodes = xmlDoc.getElementsByTagName("challenge");
        const loadedChallenges: Challenge[] = Array.from(challengeNodes).map(
          (node) => ({
            id: parseInt(
              node.getElementsByTagName("id")[0]?.textContent || "0"
            ),
            title: node.getElementsByTagName("title")[0]?.textContent || "",
            description:
              node.getElementsByTagName("description")[0]?.textContent || "",
            tags: Array.from(node.getElementsByTagName("tag")).map(
              (tagNode) => tagNode.textContent || ""
            ),
            difficulty: (node.getElementsByTagName("difficulty")[0]
              ?.textContent || "SL") as "SL" | "HL",
            type: node.getElementsByTagName("type")[0]?.textContent || "",
          })
        );

        setChallenges(loadedChallenges);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };

    fetchChallenges();
  }, []);

  const uniqueTags = Array.from(
    new Set(challenges.flatMap((challenge, index) => challenge.tags))
  );
  const uniqueDifficulties = Array.from(
    new Set(challenges.flatMap((challenge, index) => challenge.difficulty))
  );
  const difficulties = ["All", "SL", "HL"];
  //const completionStatuses = ["All", "Complete", "Not Complete"]; // This is replaced by the more dynamic "uniqueDifficulties"

  const filteredChallenges = challenges
    .filter((challenge) => {
      const { status } = getCompletionStatus(challenge.id);
      const { pointStatus } = getPointsStatus(challenge.id);

      if (
        search &&
        !challenge.title.toLowerCase().includes(search.toLowerCase())
      ) // if search is being used, filter out items that dont substring match
        return false;
      if (difficulty !== "All" && challenge.difficulty !== difficulty)
        return false; // filter out difficulties that aren't chosen
      if (selectedTag !== "All" && !challenge.tags.includes(selectedTag))
        return false; // filter out types that aren't chosen
      if (completionFilter === "Complete" && !status) return false; // filter out incomplete ones if user selected as such
      if (completionFilter === "Not Complete" && status) return false; // filter out complete ones if user selected as such
      return true; // if none of the filters applied, it must be intended
    })
    .sort((a, b) => (sortBy === "title" ? a.title.localeCompare(b.title) : 0)); // default sort by title

  return (
    <>
      <Navbar />
      <div className="bg-zinc-950 min-h-screen p-8 text-cyan-50">
        <h1 className="text-3xl font-bold mb-8">Pseudocode Challenges</h1>

        <PointTally />

        {/* Filters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-gray-400 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 rounded bg-gray-800 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Difficulty</label>
            <CustomSelect
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={["All", ...uniqueDifficulties]}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Tags</label>
            <CustomSelect
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              options={["All", ...uniqueTags]}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">
              Completion Status
            </label>
            <CustomSelect
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value)}
              options={difficulties}
            />
          </div>
        </div>

        {/* Challenges List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const { status } = getCompletionStatus(challenge.id);
            const { pointStatus } = getPointsStatus(challenge.id);

            return (
              <div
                key={challenge.id}
                className="bg-slate-800 outline-1 outline p-4 rounded-lg shadow hover:shadow-lg transition"
                onClick={()=>window.open(`challenges/${challenge.id}`)}
              >
                <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
                <p className="text-sm text-gray-400">
                  Difficulty: {challenge.difficulty}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {challenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {status ? (
                    pointStatus ? (
                      <StarIcon className="h-6 w-6 text-green-400" />
                    ) : (
                      <LightBulbIcon className="h-6 w-6 text-yellow-400" />
                    )
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-400" />
                  )}
                  <span>
                    {
                      status
                        ? pointStatus
                          ? "Completed (1 point)." // if completed and point gained
                          : "Completed with example-solution (0 points)." // if completed and point not gained
                        : "Incompleted." /*if incomplete*/
                    }
                  </span>
                </div>

                <Link
                  href={`challenges/${challenge.id}`}
                  className="text-blue-500 mt-2 inline-block"
                >
                  Solve Challenge
                </Link>
              </div>
            );
          })}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center text-gray-500 mt-6">
            No challenges found. Please try to refine the filters above or refresh the page.
          </div>
        )}
      </div>
    </>
  );
}
