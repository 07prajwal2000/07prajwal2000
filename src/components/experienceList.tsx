import { Experience } from "@/data/commands";
import { RxExternalLink } from "react-icons/rx";

interface ExperienceListProps {
  data: Experience[];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
});

export default function ExperienceList({ data }: ExperienceListProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <h2 className="text-xl lg:text-2xl font-bold">My Work Experience</h2>
      <hr />
      {data
        .sort(
          (a, b) =>
            (a.to === undefined ? 1 : new Date(a.to).getTime()) -
            (b.to === undefined ? 1 : new Date(b.to).getTime()),
        )
        .map((experience, index) => (
          <div key={index} className="flex flex-col gap-1">
            <h3 className="text-lg font-bold">{experience.role}</h3>
            {experience.companyUrl ? (
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue flex flex-row gap-2 items-center"
              >
                {experience.company} <RxExternalLink />
              </a>
            ) : (
              <p className="text-sm text-gray-500">{experience.company}</p>
            )}
            <p className="text-sm text-gray-500">
              {dateFormatter.format(new Date(experience.from))} -{" "}
              {experience.to
                ? dateFormatter.format(new Date(experience.to))
                : "Present"}
            </p>
          </div>
        ))}
    </div>
  );
}
