"use client";

import challenges_questions from "./challenge_questions.json";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase_client } from "../api/supabase_client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  type: string;
};

const challenges = challenges_questions as Challenge[];

export default function ChallengesPage() {
  const [search, setSearch] = useState<string>(""); // Search input for title
  const [difficulty, setDifficulty] = useState<string>("All"); // Selected difficulty
  const [selectedTag, setSelectedTag] = useState<string>("All"); // Selected tag
  const [sortBy, setSortBy] = useState<string>("title"); // Sort criteria
  const [user, setUser] = useState<User | null>(null); // Specify that user can be null or a User object

  const router = useRouter();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase_client.auth.getUser();
      if (data?.user) {
        setUser(data.user); // This is now valid as setUser expects User | null
      } else {
        setUser(null); // This is valid as well
      }
    };
    fetchUser();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    await supabase_client.auth.signOut();
    setUser(null);
    router.push("/");
  };

  // Extract unique tags and difficulties for filters
  const uniqueTags = Array.from(
    new Set(challenges.flatMap((challenge) => challenge.tags))
  );
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  // Filter and sort challenges
  const filteredChallenges = challenges
    .filter((challenge) => {
      // Filter by title
      if (search && !challenge.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Filter by difficulty
      if (difficulty !== "All" && challenge.difficulty !== difficulty) {
        return false;
      }

      // Filter by tag
      if (selectedTag !== "All" && !challenge.tags.includes(selectedTag)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "difficulty") {
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      return 0; // Default: No sorting
    });

  return (
    <div className="bg-gray-900 min-h-screen p-20 text-cyan-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pseudocode Challenges</h1>
        {user && (
          <div className="flex items-center space-x-4">
            {/* Display the user's email or username */}
            <span className="text-sm font-medium text-gray-300">
              Logged in as: <span className="font-semibold">{user.email}</span>
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        )}
        {!user && (
            <div className="flex items-center space-x-4">
            {/* Display the user's email or username */}
            <span className="text-sm font-medium text-gray-300">
              Logged in as: GUEST
            </span>
            <button
              onClick={handleSignOut}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-800">
        {/* Title Search */}
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded placeholder:text-gray-900"
        />

        {/* Difficulty Filter */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border p-2 rounded"
        >
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>

        {/* Tag Filter */}
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Tags</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="title">Sort by Title</option>
          <option value="difficulty">Sort by Difficulty</option>
        </select>
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <div key={challenge.id} className="bg-slate-800 p-4 shadow rounded-lg">
            <h2 className="text-xl font-bold">{challenge.title}</h2>
            <p>Difficulty: {challenge.difficulty}</p>

            {/* Tags - Styled as badges */}
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

            <Link href={`challenges/${challenge.id}`} className="text-blue-500 mt-2 inline-block">
              Solve Challenge
            </Link>
          </div>
        ))}
      </div>

      {/* No Results Found */}
      {filteredChallenges.length === 0 && (
        <div className="text-center mt-6 text-gray-500">No challenges found.</div>
      )}
    </div>
  );
}
