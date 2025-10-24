"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

async function getProject(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/slug/${slug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return await res.json();
}

export default function ProjectDetailPage({ params }) {
  const { slug } = React.use(params);
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await getProject(slug);
      setProject(result?.data?.project || null);
    };
    fetchData();
  }, [slug]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        Loading project details...
      </div>
    );
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="text-[var(--text-color)]">
      {/* === HERO === */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src={
            project.mainImage.startsWith("http")
              ? project.mainImage
              : `${process.env.NEXT_PUBLIC_API_URL}${project.mainImage}`
          }
          alt={project.title}
          fill
          priority
          className="object-cover brightness-[0.45]"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

        {/* Text */}
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-4xl font-bold text-white drop-shadow-lg"
          >
            {project.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mt-4"
          >
            {project.shortDescription}
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] font-semibold shadow-lg hover:bg-[var(--button-hover-color)] transition"
              >
                <ExternalLink size={18} /> Go Live
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] font-semibold shadow-lg hover:bg-[var(--button-hover-color)] transition"
              >
                <Github size={18} />{" "}
                {project.githubUrl2 ? "Frontend Code" : "Code"}
              </a>
            )}
            {project.githubUrl2 && (
              <a
                href={project.githubUrl2}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] font-semibold shadow-lg hover:bg-[var(--button-hover-color)] transition"
              >
                <Github size={18} /> Backend Code
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* === OVERVIEW === */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 py-20"
      >
        <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
        <div
          className="prose dark:prose-invert max-w-none text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
      </motion.section>

      {/* === TECH STACK === */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[var(--container-color-in)] py-20"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Tech Stack & Tools</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {project.technologies?.map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] border border-[var(--border-color)] shadow-sm text-sm font-medium hover:scale-105 transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* === DETAILS === */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 py-20"
      >
        <h2 className="text-3xl font-bold mb-8">Project Timeline & Status</h2>
        <div className="grid sm:grid-cols-2 gap-6 text-lg bg-[var(--container-color-in)] p-6 rounded-2xl shadow-sm">
          <div>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`${
                  project.status === "completed"
                    ? "text-green-600 dark:text-green-600"
                    : "text-yellow-600 dark:text-yellow-600"
                } font-semibold`}
              >
                {project.status}
              </span>
            </p>
            <p>
              <strong>Duration:</strong> {formatDate(project.startDate)} –{" "}
              {project.endDate ? formatDate(project.endDate) : "Present"}
            </p>
          </div>
          <div>
            <p>
              <strong>Created:</strong> {formatDate(project.createdAt)}
            </p>
            <p>
              <strong>Last Updated:</strong> {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </motion.section>

      {/* === GALLERY === */}
      {project.imageGallery?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className=""
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Project Gallery
            </h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {project.imageGallery.map((img, i) => (
                <div
                  key={i}
                  className="mb-4 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform hover:scale-[1.02]"
                >
                  <Image
                    src={
                      img.startsWith("http")
                        ? img
                        : `${process.env.NEXT_PUBLIC_API_URL}${img}`
                    }
                    alt={`${project.title} screenshot ${i + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* === TAGS === */}
      {project.tags?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-6 py-20"
        >
          <h2 className="text-3xl font-bold mb-6">Tags</h2>
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
