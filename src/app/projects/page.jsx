import Link from 'next/link';
import Image from 'next/image';

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects?isPublished=true`, { 
    next: { revalidate: 60 } 
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  
  return res.json();
}

export default async function ProjectsPage() {
  const { data } = await getProjects();
  const projects = data?.projects || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My Projects</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          A collection of my recent work and case studies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link 
            key={project._id} 
            href={`/projects/${project.slug || project._id}`}
            className="group block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800"
          >
            <div className="relative h-48 w-full">
              {project.mainImage && (
                <Image
                  src={project.mainImage.startsWith('http') 
                    ? project.mainImage 
                    : `${process.env.NEXT_PUBLIC_API_URL}${project.mainImage}`}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h2 className="text-xl font-bold text-white">{project.title}</h2>
                <p className="text-gray-200 text-sm line-clamp-2">
                  {project.shortDescription}
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies?.slice(0, 3).map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
