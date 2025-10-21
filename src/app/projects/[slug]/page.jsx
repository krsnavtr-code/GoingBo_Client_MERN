import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getProject(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/slug/${slug}`, {
      next: { revalidate: 60 } 
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch project: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error in getProject:', error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
}

export async function generateMetadata({ params }) {
  const { data } = await getProject(params.slug);
  const project = data?.project;
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [
        {
          url: project.mainImage.startsWith('http')
            ? project.mainImage
            : `${process.env.NEXT_PUBLIC_API_URL}${project.mainImage}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { data } = await getProject(params.slug);
  const project = data?.project;

  if (!project) {
    notFound();
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="prose dark:prose-invert max-w-none">
        {project.mainImage && (
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={
                project.mainImage.startsWith('http')
                  ? project.mainImage
                  : `${process.env.NEXT_PUBLIC_API_URL}${project.mainImage}`
              }
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies?.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-6">
            {project.startDate && (
              <span>
                {formatDate(project.startDate)}
                {project.endDate ? ` - ${formatDate(project.endDate)}` : ' - Present'}
              </span>
            )}
          </div>

          <p className="text-xl text-gray-700 dark:text-gray-300">
            {project.shortDescription}
          </p>
        </header>

        <div 
          className="prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

        {project.imageGallery && project.imageGallery.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.imageGallery.map((img, i) => (
                <div key={i} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={
                      img.startsWith('http')
                        ? img
                        : `${process.env.NEXT_PUBLIC_API_URL}${img}`
                    }
                    alt={`${project.title} - Gallery image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {(project.projectUrl || project.githubUrl) && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Project Links</h2>
            <div className="flex flex-wrap gap-4">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Live Project
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  View on GitHub
                </a>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
