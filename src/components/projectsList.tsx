import { Project } from "@/data/commands";
import React from "react";
import { RxExternalLink } from "react-icons/rx";

interface ProjectsListProps {
  data: Project[];
  filtered?: boolean;
}

export default function ProjectsList({ data, filtered }: ProjectsListProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-xl lg:text-2xl flex flex-row gap-1 font-bold w-full">
        <p>Projects</p> {filtered && <p className="text-sm">*</p>}
      </h2>
      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((project, index) => (
          <div key={index} className="border col-span-1 p-4 rounded-sm bg-dark">
            <h3 className="text-lg font-bold lg:font-semibold">
              {project.title}
            </h3>
            <p className="text-sm lg:text-base my-1">{project.description}</p>
            <div className="flex flex-row items-center mt-2 flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <p
                  key={index}
                  className="bg-gray text-dark text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                >
                  {tech.toLowerCase()}
                </p>
              ))}
            </div>

            {project.url && (
              <a
                href={project.url}
                className="text-blue-500 inline-flex flex-row items-center gap-2 mt-4 text-xs hover:underline"
              >
                {project.url} <RxExternalLink />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
