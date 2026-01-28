import type { Education } from "@/data/commands";
import { LuBookOpenText, LuGraduationCap } from "react-icons/lu";
import { MdCalendarToday, MdGrade, MdLocationPin } from "react-icons/md";

interface EducationCardProps {
  education: Education[];
}

export default function EducationCard({ education }: EducationCardProps) {
  return (
    <div>
      <h2 className="text-lg lg:text-3xl font-bold">My Education</h2>
      <hr className="my-4" />
      <div className="flex flex-col space-y-4">
        {education.map((edu, i) => (
          <div key={edu.university}>
            <h3 className="text-sm lg:text-2xl font-bold lg:font-semibold">
              {i + 1}. {edu.university}{" "}
              <span className="hidden lg:inline">({edu.duration})</span>
            </h3>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex flex-row items-center space-x-2  pl-6 text-sm lg:text-lg">
                <span className="font-semibold">
                  <LuBookOpenText size={20} />
                </span>
                <span>{edu.course}</span>
              </div>
              <div className="flex flex-row items-center space-x-2 pl-6 text-sm lg:text-lg">
                <span className="font-semibold">
                  <LuGraduationCap size={20} />
                </span>
                <span>{edu.grade}</span>
              </div>
              <div className="flex flex-row space-x-2 pl-6 items-center text-sm lg:text-lg">
                <span className="font-semibold">
                  <MdLocationPin size={20} />
                </span>
                <span>{edu.location}</span>
              </div>
              <div className="flex lg:hidden flex-row space-x-2 pl-6 items-center text-sm lg:text-lg">
                <span className="font-semibold">
                  <MdCalendarToday size={20} />
                </span>
                <span>{edu.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
