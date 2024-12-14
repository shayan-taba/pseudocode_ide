"use client";

import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface DataTypeSectionProps {
  id: string;
  name: string;
  description: React.ReactNode; // Allow React components
  constructorDescription?: React.ReactNode;
  constructorExample: string;
  methods: { name: string; description: string }[];
  attributes: { name: string; description: string }[];
  errors: { name: string; description: string }[];
}

const DataTypeSection: React.FC<DataTypeSectionProps> = ({
  id,
  name,
  description,
  constructorDescription,
  constructorExample,
  methods,
  attributes,
  errors,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id={id} className="p-6">
      <div className="flex items-center mb-4 flex-row-reverse gap-4">
        <h2 className="text-3xl font-bold flex-1">{name}</h2>
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
          <div className="mb-4">{description}</div>

          <h3 className="text-2xl font-semibold mb-2">Construction</h3>
          {constructorDescription && (
            <div className="mb-4">{constructorDescription}</div>
          )}
          <pre className="bg-slate-800 p-4 rounded mb-4">
            <code>{constructorExample}</code>
          </pre>

          <h3 className="text-2xl font-semibold mb-2">Methods</h3>
          <ul className="list-disc list-inside mb-4">
            {methods.map((method) => (
              <li key={method.name}>
                <strong>{method.name}:</strong> {method.description}
              </li>
            ))}
          </ul>

          <h3 className="text-2xl font-semibold mb-2">Attributes</h3>
          <ul className="list-disc list-inside mb-4">
            {attributes.map((attribute) => (
              <li key={attribute.name}>
                <strong>{attribute.name}:</strong> {attribute.description}
              </li>
            ))}
          </ul>

          <h3 className="text-2xl font-semibold mb-2">Errors</h3>
          <ul className="list-disc list-inside">
            {errors.map((error) => (
              <li key={error.name}>
                <strong>{error.name}:</strong> {error.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default DataTypeSection;
