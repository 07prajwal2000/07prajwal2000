import { Skill } from "@/data/commands";
import { useMemo } from "react";

interface SkillsListProps {
  data: Skill[];
}

export default function SkillsList({ data }: SkillsListProps) {
  const skillsList = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const skill of data) {
      const category = map.get(skill.category);
      if (category) {
        category.push(skill);
      } else {
        map.set(skill.category, [skill]);
      }
    }
    return Array.from(map.values()).sort((a, b) => a[0].order - b[0].order);
  }, [data]);
  return (
    <div>
      <h2 className="text-xl lg:text-2xl font-bold text-center">Skills</h2>
      <hr className="my-4" />
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 lg:gap-8 px-4 justify-center">
        {skillsList.map((categorySkills) => (
          <div key={categorySkills[0].category}>
            <h2 className="text-xl font-bold">{categorySkills[0].category}</h2>
            <ul className="list-disc pl-4">
              {categorySkills.map((skill) => (
                <li key={skill.skillName}>
                  {skill.skillName} ({skill.rating}⭐)
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
