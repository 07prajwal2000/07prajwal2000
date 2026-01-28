import Terminal from "@/components/terminal";
import TerminalFooter from "@/components/terminalFooter";
import { TerminalProvider } from "@/context/terminal";
import { CliBuilder } from "@/lib/cliParser";
import { addHelpCommand } from "@/data/commands";
import { addLsCommands } from "@/data/commands";
import { addOpenCommands } from "@/data/commands";
import { addEchoCommands } from "@/data/commands";
import { addSocialCommands } from "@/data/commands";
import { useMemo } from "react";
import { useHistoryActions } from "@/store/history";
import { InferGetStaticPropsType } from "next";
import {
  getBlogList,
  getEducationList,
  getExperienceList,
  getProfileData,
  getProjectsList,
  getSkillsList,
  getSocialLinks,
} from "@/data/gqlLoader";
import axios from "axios";

export async function getStaticProps() {
  const fetcher = axios.create({
    baseURL: process.env.HYGRAPH_URL,
    headers: {
      Authorization: `Bearer ${process.env.HYGRAPH_API_KEY}`,
    },
  });
  const socialLinks = await getSocialLinks(fetcher);
  const projects = await getProjectsList(fetcher);
  const skills = await getSkillsList(fetcher);
  const blogs = await getBlogList();
  const experiences = await getExperienceList(fetcher);
  const education = await getEducationList(fetcher);
  const profile = await getProfileData(fetcher);
  return {
    props: {
      socialLinks,
      projects,
      skills,
      blogs,
      experiences,
      education,
      profile,
    },
  };
}

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { clearHistory } = useHistoryActions();
  const parser = useMemo(() => {
    const builder = new CliBuilder();
    addHelpCommand(builder);
    addEchoCommands(builder, {
      education: props.education,
      experience: props.experiences,
      socials: props.socialLinks,
      skills: props.skills,
      projects: props.projects,
      profile: props.profile,
    });
    addSocialCommands(builder, props.socialLinks);
    addOpenCommands(builder, props.socialLinks);
    addLsCommands(builder, props.blogs, props.projects);
    builder.addCommand("clear", {
      executor: () => {
        clearHistory();
      },
      helpText: "Clears the terminal",
    });
    return builder.build();
  }, []);

  return (
    <div className="w-dvw h-dvh flex flex-col p-4 overflow-hidden">
      <TerminalProvider value={{ cliParser: parser }}>
        <Terminal />
        <TerminalFooter />
      </TerminalProvider>
    </div>
  );
}
