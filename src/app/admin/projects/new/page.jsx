'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ProjectForm component to avoid SSR issues with ReactQuill
const ProjectForm = dynamic(
  () => import('@/components/admin/projects/ProjectForm'),
  { ssr: false }
);

const NewProjectPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectForm />
    </div>
  );
};

export default NewProjectPage;
