'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ProjectForm component to avoid SSR issues with ReactQuill
const PackageForm = dynamic(
  () => import("@/components/admin/packages/PackageForm"),
  { ssr: false }
);

const NewPackagePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PackageForm />
    </div>
  );
};

export default NewPackagePage;
