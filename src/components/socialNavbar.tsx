import type { FC } from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { CgNotes } from "react-icons/cg";

interface SocialNavbarProps {
  github: string;
  linkedin: string;
  email: string;
  blog: string;
}

const SocialNavbar: FC<SocialNavbarProps> = ({
  github,
  linkedin,
  email,
  blog,
}) => {
  const emailLink = email.includes("mailto:") ? email : `mailto:${email}`;
  return (
    <div className="flex justify-center gap-8 lg:gap-6">
      <a href={github} target="_blank" title="GitHub">
        <FaGithub size={30} />
      </a>
      <a href={linkedin} target="_blank" title="LinkedIn">
        <FaLinkedin size={30} />
      </a>
      <a href={emailLink} target="_blank" title="Email">
        <MdEmail size={30} />
      </a>
      <a href={blog} target="_blank" title="Blog">
        <CgNotes size={30} />
      </a>
    </div>
  );
};

export default SocialNavbar;
