import type { FC } from "react";
import { CgNotes } from "react-icons/cg";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { PiReadCvLogoFill } from "react-icons/pi";

interface SocialListProps {
  github: string;
  linkedin: string;
  email: string;
  blog: string;
  resume?: string;
}

const SocialList: FC<SocialListProps> = ({
  github,
  linkedin,
  email,
  blog,
  resume,
}) => {
  const emailLink = email.includes("mailto:") ? email : `mailto:${email}`;
  return (
    <div className="flex flex-col text-white justify-center gap-5 text-lg lg:text-xl">
      <p className="text-lg lg:text-xl font-bold">Connect with me</p>
      <a
        href={github}
        target="_blank"
        title="GitHub"
        className="flex gap-4 items-center hover:text-blue"
      >
        <FaGithub className="text-2xl lg:text-3xl" />
        <p className="font-bold text-sm lg:text-lg">GitHub</p>
      </a>
      <a
        href={linkedin}
        target="_blank"
        title="LinkedIn"
        className="flex gap-4 items-center hover:text-blue"
      >
        <FaLinkedin className="text-2xl lg:text-3xl" />
        <p className="font-bold text-sm lg:text-lg">LinkedIn</p>
      </a>
      <a
        href={emailLink}
        target="_blank"
        title="Email"
        className="flex gap-4 items-center hover:text-blue"
      >
        <MdEmail className="text-2xl lg:text-3xl" />
        <p className="font-bold text-sm lg:text-lg">Email</p>
      </a>
      <a
        href={blog}
        target="_blank"
        title="Blog"
        className="flex gap-4 items-center hover:text-blue"
      >
        <CgNotes className="text-2xl lg:text-3xl" />
        <p className="font-bold text-sm lg:text-lg">Blog</p>
      </a>
      {resume && (
        <a
          href={resume}
          target="_blank"
          title="Resume"
          className="flex gap-4 items-center hover:text-blue"
        >
          <PiReadCvLogoFill className="text-2xl lg:text-3xl" />
          <p className="font-bold text-sm lg:text-lg">Resume</p>
        </a>
      )}
    </div>
  );
};

export default SocialList;
