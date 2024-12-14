"use client";

import React, { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface DocumentationItem {
  type: "description" | "code"; // To differentiate between description and code
  content: React.ReactNode | string; // Could be a React component or a string (for code)
}

interface DocumentationSection {
  title: string;
  items: DocumentationItem[]; // Array of optional descriptions and code blocks
}

interface GeneralDocumentationProps {
  sections: DocumentationSection[];
}

const GeneralDocumentation: React.FC<GeneralDocumentationProps> = ({
  sections,
}) => {
  return (
    <div className="p-6 pb-0">
      {sections.map((section, index) => (
        <AccordionSection key={index} section={section} />
      ))}
    </div>
  );
};

// Accordion Section Component
const AccordionSection: React.FC<{ section: DocumentationSection }> = ({
  section,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (section.title === "Introduction") {
      setIsOpen(true); // Automatically open the "Introduction" section
    }
  }, [section.title]);

  return (
    <section className="mb-12">
      <div className="flex items-center mb-4 flex-row-reverse gap-4">
        <h2 className="text-3xl font-bold flex-1">{section.title}</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <ChevronDownIcon className="h-6 w-6" />
          ) : (
            <ChevronRightIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div>
          {/* Render Items (Descriptions and Code Blocks) */}
          {section.items.map((item, idx) => (
            <div key={idx} className="mb-4">
              {item.type === "description" ? (
                <div>{item.content}</div> // Render description
              ) : (
                <pre className="bg-slate-800 p-4 rounded">
                  <code>{item.content}</code> {/* Render code block */}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GeneralDocumentation;
