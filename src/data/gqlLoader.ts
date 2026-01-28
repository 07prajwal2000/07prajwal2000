import axios, { AxiosInstance } from "axios";
import {
  Blog,
  Education,
  Experience,
  ProfileInfo,
  Project,
  Skill,
} from "./commands";

export async function getSocialLinks(
  fetcher: AxiosInstance,
): Promise<{ url: string; label: string; active: boolean }[]> {
  const query = `
  {
    Social: rawContent(where: {contentId: "Social"}) {
      data: rawJsonData
    }
  }`;
  const response = await fetcher.post("", { query });
  return response.data.data.Social.data;
}

export async function getProfileInfo(fetcher: AxiosInstance) {
  const query = `
  {
    Profile: rawContent(where: {contentId: "Profile"}) {
      data: rawJsonData
    }
  }`;
  const response = await fetcher.post("", { query });
  return response.data.data.Profile.data as ProfileInfo;
}

export async function getProfileData(fetcher: AxiosInstance): Promise<{
  name: string;
  contact: {
    email: string;
    linkedIn: string;
    github: string;
  };
  sections: string[];
}> {
  const query = `
  {
    Profile: rawContent(where: {contentId: "Profile"}) {
      data: rawJsonData
    }
  }`;
  const response = await fetcher.post("", { query });
  return response.data.data.Profile.data as {
    name: string;
    contact: {
      email: string;
      linkedIn: string;
      github: string;
    };
    sections: string[];
  };
}
export async function getBlogList() {
  let count = 1;
  const blogs: Blog[] = [];
  while (true) {
    const query = `
      {
        publication(host: "07prajwal2000.hashnode.dev") {
          title
          posts(first: ${count * 50}) {
            edges {
              node {
                slug
                title
                url
                subtitle
                publishedAt
                # useful for frequent deployments
                Cache_${Math.round(Math.random() * 100000)}_INVALIDATOR: views
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      }
      `;
    const response = await axios.post("https://gql.hashnode.com/", { query });
    const data = response.data.data.publication;
    const { edges, pageInfo } = data.posts;
    for (let edge of edges) {
      blogs.push({
        id: edge.node.slug,
        title: edge.node.title,
        url: edge.node.url,
        subtitle: edge.node.subtitle,
        publishedAt: edge.node.publishedAt,
      });
    }
    if (!pageInfo.hasNextPage) {
      break;
    }
    count++;
  }
  return blogs;
}

export async function getBlogDetails(slug: string) {
  const query = `
    {
      publication(host: "07prajwal2000.hashnode.dev") {
        post(slug: "${slug}") {
          title
          subtitle
          tags {
            name
          }
          content {
            markdown
          }
          # useful for frequent deployments
          Cache_${Math.round(Math.random() * 100000)}_INVALIDATOR: views
        }
      }
    }
    `;
  const response = await axios.post("https://gql.hashnode.com/", { query });
  return {
    title: response.data.data.publication.post.title as string,
    subtitle: response.data.data.publication.post.subtitle as string,
    tags: response.data.data.publication.post.tags.map(
      (tag: any) => tag.name,
    ) as string[],
    content: response.data.data.publication.post.content.markdown as string,
  };
}

export async function getProjectsList(fetcher: AxiosInstance) {
  let skip = 0;
  const projectsList: Project[] = [];
  while (true) {
    const query = `
    {
      projects(skip: ${skip}) {
        id
        title
        url
        description
        techStack
      }
    }`;
    const response = await fetcher.post("", { query });
    projectsList.push(
      ...(response.data.data.projects.map((project: any) => ({
        id: project.id as string,
        title: project.title as string,
        url: project.url as string,
        description: project.description as string,
        techStack: project.techStack
          .split(",")
          .map((tech: string) => tech.trim()),
      })) as Project[]),
    );
    if (response.data.data.projects.length < 10) break;
    skip += 10;
  }
  return projectsList;
}

export async function getSkillsList(fetcher: AxiosInstance) {
  let skip = 0;
  const skillsList: Skill[] = [];
  while (true) {
    const query = `
    {
      skills(skip: ${skip}) {
        skillName
        rating
        category {
          name
          order
        }
      }
    }
    `;
    const response = await fetcher.post("", { query });
    const skills = response.data.data.skills.map((skill: any) => ({
      skillName: skill.skillName as string,
      rating: skill.rating as number, // 1-5
      category: skill.category.name as string,
      order: skill.category.order as number,
    }));
    if (skills.length === 0) break;
    skip += skills.length;
    skillsList.push(...skills);
  }
  return skillsList;
}

export async function getExperienceList(fetcher: AxiosInstance) {
  const query = `
    {
      experiences {
        company
        role
        from
        to
        companyUrl
      }
    }`;
  const response = await fetcher.post("", { query });
  return response.data.data.experiences.map((experience: any) => ({
    company: experience.company as string,
    role: experience.role as string,
    from: experience.from,
    to: experience?.to,
    companyUrl: experience.companyUrl as string,
  })) as Experience[];
}

export async function getEducationList(fetcher: AxiosInstance) {
  const query = `
    {
      rawContent (where: {contentId: "Education"}) {
        rawJsonData
      }
    }`;
  const response = await fetcher.post("", { query });
  return response.data.data.rawContent.rawJsonData.map((content: any) => ({
    grade: content.grade as string,
    location: content.location as string,
    university: content.university as string,
    course: content.course as string,
    duration: content.duration as string,
  })) as Education[];
}
