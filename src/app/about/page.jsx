'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCode, FaLaptopCode, FaGraduationCap, FaTools } from 'react-icons/fa';

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const skills = [
    'JavaScript (ES6+)', 'React.js', 'Node.js', 'Next.js', 'TypeScript',
    'HTML5 & CSS3', 'Tailwind CSS', 'Git & GitHub', 'RESTful APIs', 'MongoDB'
  ];

  const experience = [
    {
      role: 'Frontend Developer',
      company: 'Tech Solutions Inc.',
      duration: '2022 - Present',
      description: 'Building responsive web applications using React and Next.js'
    },
    {
      role: 'Web Developer',
      company: 'Digital Creatives',
      duration: '2020 - 2022',
      description: 'Developed and maintained client websites with modern JavaScript frameworks'
    }
  ];

  const education = [
    {
      degree: 'BSc in Computer Science',
      institution: 'Tech University',
      year: '2016 - 2020'
    },
    {
      degree: 'Web Development Bootcamp',
      institution: 'Code Academy',
      year: '2019'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--container-color)] text-[var(--text-color)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Passionate developer with a focus on creating beautiful, functional, and user-centered digital experiences.
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 items-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div>
            <h2 className="text-2xl font-semibold mb-4">Who I Am</h2>
            <p className="mb-6">
              I'm a full-stack developer with a passion for creating elegant solutions to complex problems. 
              With over 4 years of experience in web development, I specialize in building responsive, 
              accessible, and performant web applications.
            </p>
            <p>
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
              or enjoying outdoor activities.
            </p>
          </div>
          <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
            {/* Replace with your actual image */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span>Your Photo</span>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.section 
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex items-center mb-8">
            <FaTools className="text-[var(--text-color)] text-2xl mr-3" />
            <h2 className="text-2xl font-semibold">Skills & Technologies</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className="bg-[var(--container-color-in)] p-4 rounded-lg shadow-sm border border-[var(--container-color)] hover:shadow-md transition-shadow"
              >
                <p className="text-[var(--text-color)]">{skill}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Experience Section */}
          <motion.section 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex items-center mb-8">
              <FaLaptopCode className="text-[var(--text-color)] text-2xl mr-3" />
              <h2 className="text-2xl font-semibold">Experience</h2>
            </div>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-[var(--container-color)]">
                  <div className="absolute -left-2 w-4 h-4 bg-[var(--container-color)] rounded-full"></div>
                  <h3 className="text-xl font-medium">{exp.role}</h3>
                  <p className="text-[var(--text-color)] font-medium">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-2">{exp.duration}</p>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Education Section */}
          <motion.section 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex items-center mb-8">
              <FaGraduationCap className="text-[var(--text-color)] text-2xl mr-3" />
              <h2 className="text-2xl font-semibold">Education</h2>
            </div>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-[var(--container-color)]">
                  <div className="absolute -left-2 w-4 h-4 bg-[var(--container-color)] rounded-full"></div>
                  <h3 className="text-xl font-medium">{edu.degree}</h3>
                  <p className="text-[var(--text-color)] font-medium">{edu.institution}</p>
                  <p className="text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;