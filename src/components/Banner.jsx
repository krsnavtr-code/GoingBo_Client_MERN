import React from "react";
import { FiGithub, FiLinkedin, FiMail, FiDownload } from "react-icons/fi";
import { SiGo, SiNodedotjs } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "./ui";

const Banner = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const user = {
    image: "/avatar.png",
    name: "Krishna Avtar",
    role: "Software Engineer – Web Development",
    description: "Making The Impossible Possible. Using 1’s and 0’s.",
    description2: "Problem solving is what makes me unique.",
    experience: "7",
    projects: "203",
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-16">
      {/* LEFT SIDE */}
      <motion.div
        className="flex-1 text-center md:text-left"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.span
          className="inline-block bg-[var(--container-color-in)] text-[var(--text-color)] px-4 py-1 rounded-full text-sm font-medium mb-4"
          variants={itemVariants}
        >
          {user.role}
        </motion.span>

        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
          variants={itemVariants}
        >
          {user.description}
        </motion.h1>

        <motion.p
          className="text-lg mb-10 text-[var(--text-color-light)]"
          variants={itemVariants}
        >
          {user.description2}
        </motion.p>

        <motion.div
          className="flex items-center justify-center md:justify-start gap-10 mb-10"
          variants={itemVariants}
        >
          <div>
            <h2 className="text-4xl font-bold">{user.experience}</h2>
            <p className="text-sm text-[var(--text-color-light)]">Years of Experience</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold">{user.projects}</h2>
            <p className="text-sm text-[var(--text-color-light)]">Projects / Contributions</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            as="a"
            href="/resume.pdf"
            download
            variant="secondary"
          >
            View CV
          </Button>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE */}
      <motion.div
        className="flex-1 mt-16 md:mt-0 relative flex justify-center items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Circle */}
        <div className="w-64 h-64 md:w-80 md:h-80 bg-orange-600 rounded-full absolute"></div>

        {/* Profile Image */}
        <motion.img
          src={user.image}
          alt="profile"
          className="relative w-56 md:w-72 rounded-full z-10"
          variants={itemVariants}
        />

        {/* Tech Icons */}
        <motion.div
          className="absolute top-10 right-10 bg-[#2a2a2a] p-3 rounded-full text-cyan-400 text-3xl shadow-lg"
          variants={itemVariants}
        >
          <SiGo />
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-10 bg-[#2a2a2a] p-3 rounded-full text-yellow-400 text-3xl shadow-lg"
          variants={itemVariants}
        >
          <FaPython />
        </motion.div>

        <motion.div
          className="absolute bottom-0 right-16 bg-[#2a2a2a] p-3 rounded-full text-green-500 text-3xl shadow-lg"
          variants={itemVariants}
        >
          <SiNodedotjs />
        </motion.div>
      </motion.div>
    </section>
  );
};
export default Banner;
