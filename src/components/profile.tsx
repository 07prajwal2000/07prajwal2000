import { Experience, ProfileInfo, Project, Skill } from "@/data/commands";
import SkillsList from "./skillsList";
import ExperienceList from "./experienceList";
import ProjectsList from "./projectsList";

interface ProfileProps {
  data: ProfileInfo;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
}

export default function Profile({
  data,
  skills,
  experience,
  projects,
}: ProfileProps) {
  return (
    <div className="border border-gray p-4 flex flex-col gap-4 w-full rounded-sm">
      <h2 className="font-bold text-lg lg:text-2xl text-center">{data.name}</h2>
      <div className="flex flex-row text-sm justify-center items-center gap-4 text-blue">
        <a href={data.contact.linkedIn} className="">
          LinkedIn
        </a>
        <a href={data.contact.github} className="">
          GitHub
        </a>
        <a href={`mailto:${data.contact.email}`} className="">
          Email
        </a>
      </div>
      {data.sections.includes("skills") && <SkillsList data={skills} />}
      {data.sections.includes("experience") && (
        <ExperienceList data={experience} />
      )}
      {data.sections.includes("projects") && <ProjectsList data={projects} />}
    </div>
  );
}
