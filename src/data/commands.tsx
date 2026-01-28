import BlogList from "@/components/blogList";
import EducationCard from "@/components/educationCard";
import ExperienceList from "@/components/experienceList";
import Profile from "@/components/profile";
import ProjectsList from "@/components/projectsList";
import SkillsList from "@/components/skillsList";
import SocialList from "@/components/socialList";
import { CliBuilder } from "@/lib/cliParser";

export function addHelpCommand(builder: CliBuilder) {
  builder.addCommand("help", {
    executor: (context) => {
      const argValue =
        context.options["--command"]?.toString() ||
        context.options["-c"]?.toString();
      if (argValue) {
        return context.parser.getCommandHelp(argValue);
      }
      return context.parser.getHelpText();
    },
    helpText: "Prints help (-c '' prints specific command help)",
    options: [
      {
        long: "--command",
        helpText: "Displays help for a specific command",
        hasValue: true,
        short: "-c",
      },
    ],
  });
}

export type Skill = {
  skillName: string;
  rating: number;
  category: string;
  order: number;
};

export type Experience = {
  role: string;
  company: string;
  from: string;
  to?: string;
  companyUrl?: string;
};

export type ProfileInfo = {
  name: string;
  contact: {
    email: string;
    linkedIn: string;
    github: string;
  };
  sections: string[];
};

export type Education = {
  grade: string;
  location: string;
  university: string;
  duration: string;
  course: string;
};

export function addEchoCommands(
  builder: CliBuilder,
  data: {
    skills: Skill[];
    socials: SocialItem[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
    profile: ProfileInfo;
  },
) {
  const printCommand = builder.addCommand("echo", {
    executor: (context) => {
      return context.parser.getCommandHelp("echo");
    },
    helpText: "Prints profile information",
  });

  printCommand.addSubCommand("skills", {
    executor: (context) => {
      return <SkillsList data={data.skills} />;
    },
    helpText: "Prints list of skills",
  });

  printCommand.addSubCommand("projects", {
    executor: (context) => {
      return <ProjectsList data={data.projects} />;
    },
    helpText: "Displays list of projects",
  });

  printCommand.addSubCommand("edu", {
    executor: (context) => {
      return <EducationCard education={data.education} />;
    },
    helpText: "Displays list of education",
  });

  printCommand.addSubCommand("exp", {
    executor: (context) => {
      return <ExperienceList data={data.experience} />;
    },
    helpText: "Displays list of experience",
  });

  printCommand.addSubCommand("profile", {
    executor: (context) => {
      return (
        <Profile
          data={data.profile}
          skills={data.skills}
          experience={data.experience}
          projects={data.projects}
        />
      );
    },
    helpText: "Displays profile information and summary",
  });
}

export type SocialItem = {
  url: string;
  label: string;
  active: boolean;
};

export function addSocialCommands(
  builder: CliBuilder,
  socialItems: SocialItem[],
) {
  builder.addCommand("social", {
    executor: () => {
      const github = socialItems.find(
        (item) => item.label.toLowerCase() === "github",
      );
      const email = socialItems.find(
        (item) => item.label.toLowerCase() === "email",
      );
      const linkedin = socialItems.find(
        (item) => item.label.toLowerCase() === "linkedin",
      );
      const blog = socialItems.find(
        (item) => item.label.toLowerCase() === "blog",
      );
      const resume = socialItems.find(
        (item) => item.label.toLowerCase() === "resume",
      );
      return (
        <SocialList
          blog={blog!.url}
          github={github!.url}
          email={email!.url}
          linkedin={linkedin!.url}
        />
      );
    },
    helpText: "Displays social links",
  });
}

export function addOpenCommands(
  builder: CliBuilder,
  socialItems: SocialItem[],
) {
  const openCommand = builder.addCommand("open", {
    executor: (context) => {
      return context.parser.getCommandHelp("open");
    },
    helpText: "Opens a URL",
  });

  openCommand.addSubCommand("<VALUE>", {
    executor: (context) => {
      const value = context.values["<VALUE>"];
      if (!value || !URL.canParse(value)) {
        throw "Please provide a valid URL format e.g. https://example.com";
      }
      window.open(value, "_blank");
      return `Opening ${value}...`;
    },
    helpText: "Opens a URL",
  });

  socialItems
    .filter((item) => item.active)
    .forEach((item) => {
      openCommand.addSubCommand(item.label.toLowerCase(), {
        executor: (context) => {
          let url = item.url;
          if (url.includes("@") && !url.includes("mailto:")) {
            url = `mailto:${url}`;
          }
          window.open(url, "_blank");
          return `Opening ${item.label}...`;
        },
        helpText: `Opens ${item.label}`,
      });
    });
}

export type Blog = {
  id: string;
  title: string;
  url: string;
  subtitle: string;
  publishedAt: string;
};

export type Project = {
  title: string;
  url: string;
  description: string;
  techStack: string[];
};

export function addLsCommands(
  builder: CliBuilder,
  blogs: Blog[],
  projects: Project[],
) {
  const lsCommand = builder.addCommand("ls", {
    executor: (context) => {
      return context.parser.getCommandHelp("ls");
    },
    helpText: "Lists out things",
  });
  lsCommand.addSubCommand("blogs", {
    executor: (context) => {
      const search =
        context.options["--search"]?.toString() ||
        context.options["-s"]?.toString();
      const filteredBlogs = search
        ? blogs.filter((blog) =>
            blog.title.toLowerCase().includes(search.toLowerCase()),
          )
        : blogs;
      return <BlogList data={filteredBlogs} filtered={!!search} />;
    },
    helpText: "Lists out blogs",
    options: [
      {
        long: "--search",
        helpText: "Searches for blogs",
        hasValue: true,
        short: "-s",
      },
    ],
  });

  lsCommand.addSubCommand("projects", {
    executor: (context) => {
      const search =
        context.options["--search"]?.toString() ||
        context.options["-s"]?.toString();
      const filteredProjects = search
        ? projects.filter((project) =>
            project.title.toLowerCase().includes(search.toLowerCase()),
          )
        : projects;
      return <ProjectsList data={filteredProjects} filtered={!!search} />;
    },
    helpText: "Lists out Open Source projects",
    options: [
      {
        long: "--search",
        helpText: "Searches for Open Source projects",
        hasValue: true,
        short: "-s",
      },
    ],
  });
}
