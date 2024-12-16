"use client";

import React, { useState, useEffect } from "react";
import DataTypeSection from "./components/ib_datatype_sections";
import "./documentation_styles.css";
import GeneralDocumentation from "./components/general_sections";
import { dataTypes, generalDocumentationSections } from "./documentation_data";
import Navbar from "../components/nav_bar";

const DocumentationPage: React.FC = () => {
  const [toc, setToc] = useState<
    { id: string; title: string; level: number }[]
  >([]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("main h2, main h3"));
    const newToc = headings.map((heading) => {
      // Find the closest ancestor section (or div, or whichever container holds the heading)
      const sectionAncestor = heading.closest("section"); // Adjust this selector as needed for your structure
  
      // Get the id of the closest ancestor section
      const id = sectionAncestor?.id || ""; // Fallback to an empty string if no id is found
  
      return {
        id,
        title: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      };
    });
  
    setToc(newToc);
  }, []);
  

  return (
    <div id="documentationPage" className="flex bg-slate-900 text-white min-h-screen w-[100vw]">
      <aside className="bg-slate-900 p-8 w-[25%] z-10 absolute">
        <div className="relative w-100%">
        <h2 className="text-4xl font-bold mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          {toc.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={`#${item.id}`} // This links to the dynamically generated id
              className={`block pl-${item.level * 4} hover:text-zinc-300 hover:underline text-xl`}
            >
              {item.title}
            </a>
          ))}
        </nav>
        </div>
      </aside>


      <main className="flex-1 p-6 bg-zinc-950 absolute left-[25%] overflow-scroll">
        <Navbar/>
        <h1 className="text-4xl font-extrabold m-6">
          Pseudocode Documentation
        </h1>

        <GeneralDocumentation sections={generalDocumentationSections} />

        {dataTypes.map((dataType, index) => (
          <DataTypeSection key={`${dataType.id}-${index}`} {...dataType} />
        ))}
      </main>
    </div>
  );
};

export default DocumentationPage;
