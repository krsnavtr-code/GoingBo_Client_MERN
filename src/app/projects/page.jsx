import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";

async function getProjects() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects?isPublished=true`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export default async function ProjectsPage() {
  const { data } = await getProjects();
  const projects = data?.projects || [];

  return (
    <div className="container text-[var(--text-color)] mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">My Projects</h1>
        <p className="text-lg max-w-2xl mx-auto">
          A selection of my best work showcasing full-stack web development, UI
          design, and modern tech stacks.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="">No projects found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group bg-[var(--container-color-in)] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[var(--border-color)]"
            >
              {/* Image Section */}
              <Link href={`/projects/${project.slug || project._id}`}>
                <div className="relative h-56 w-full overflow-hidden">
                  {project.mainImage && (
                    <Image
                      src={
                        project.mainImage.startsWith("http")
                          ? project.mainImage
                          : `${process.env.NEXT_PUBLIC_API_URL}${project.mainImage}`
                      }
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 bg-[var(--button-bg-color)] text-[var(--button-color)] rounded px-1">
                    <span className="text-xs font-semibold uppercase">
                      {project.status || "In Progress"}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Content Section */}
              <div className="p-5 flex flex-col justify-between h-[230px]">
                <div>
                  <Link href={`/projects/${project.slug || project._id}`}>
                    <h2 className="text-lg font-semibold hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                      {project.title}
                    </h2>
                  </Link>

                  <p className="mt-2 text-sm line-clamp-3 text-[var(--text-color-light)]">
                    {project.shortDescription}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies?.length > 3 && (
                      <span className="text-xs text-[var(--text-color-light)]">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    {project.projectUrl && (
                      <Link
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm hover:underline px-2 py-1 rounded bg-[var(--button-bg-color)] text-[var(--button-color)]"
                      >
                        <ExternalLink size={16} /> Live
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm hover:underline px-2 py-1 rounded bg-[var(--button-bg-color)] text-[var(--button-color)]"
                      >
                        <Github size={16} />{" "}
                        {project.githubUrl2 ? "F-Code" : "Code"}
                      </Link>
                    )}
                    {project.githubUrl2 && (
                      <Link
                        href={project.githubUrl2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm hover:underline px-2 py-1 rounded bg-[var(--button-bg-color)] text-[var(--button-color)]"
                      >
                        <Github size={16} /> B-Code
                      </Link>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.slug || project._id}`}
                    className="text-sm font-medium hover:underline px-2 py-1 rounded bg-[var(--button-bg-color)] text-[var(--button-color)]"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
