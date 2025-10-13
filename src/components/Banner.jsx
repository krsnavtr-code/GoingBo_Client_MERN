import React from "react";
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiNextdotjs, SiMysql } from "react-icons/si";

import { motion } from "framer-motion";
import { Button } from "./ui";
import { useEffect, useState } from "react";

const Banner = () => {
  const [user, setUser] = useState({
    image: "/avatar.png",
    role: "Software Engineer – Web Development",
    name: "Krishna Avtar",
    description: "Making The Impossible Possible. Using 1's and 0's.",
    sortDescription: "Problem solving is what makes me unique.",
    experience: "2.5",
    projects: "203",
    cvPdf: "/resume.pdf",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        if (data) {
          setUser({
            image: data.image || "/avatar.png",
            role: data.role || "",
            name: data.name || "",
            description: data.description || "",
            sortDescription: data.sortDescription || "",
            experience: data.experience?.toString() || "0",
            projects: data.projects?.toString() || "0",
            cvPdf: data.cvPdf || "#",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="max-w-[1650px] mx-auto flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-16 mt-16 lg:mt-0">
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
          className="text-4xl font-bold mb-4 leading-tight"
          variants={itemVariants}
        >
          {user.description}
        </motion.h1>

        <motion.p
          className="text-lg mb-10 text-[var(--text-color-light)]"
          variants={itemVariants}
        >
          {user.sortDescription}
        </motion.p>

        <motion.div
          className="flex items-center justify-center md:justify-start gap-10 mb-10"
          variants={itemVariants}
        >
          <div>
            <h2 className="text-4xl font-bold">{user.experience}</h2>
            <p className="text-sm text-[var(--text-color-light)]">
              Years of Experience
            </p>
          </div>
          <div>
            <h2 className="text-4xl font-bold">{user.projects}</h2>
            <p className="text-sm text-[var(--text-color-light)]">
              Projects / Contributions
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button as="a" href={user.cvPdf} download variant="secondary">
            View CV
          </Button>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE - Hidden on small and medium screens */}
      <motion.div
        className="hidden lg:flex flex-1 mt-16 lg:mt-0 relative justify-center items-center"
        style={{ minWidth: "500px", maxWidth: "501px" }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Circle */}
        <div className="w-64 h-64 lg:w-80 lg:h-80 bg-[var(--logo-bg-color)] rounded-full absolute"></div>

        {/* Profile Image */}
        <motion.div
          className="relative w-56 lg:w-78 rounded-full z-10"
          variants={itemVariants}
        >
          <motion.img
            src={user.image?.includes('process.env.NEXT_PUBLIC_API_URL')
              ? process.env.NEXT_PUBLIC_API_URL + user.image.split('"')[1]
              : user.image || "/avatar.png"}
            alt="profile"
            className="relative w-56 lg:w-78 rounded-full z-10"
            variants={itemVariants}
            onError={(e) => {
              e.target.src = '/avatar.png';
            }}
          />
          <motion.h1
            className="text-4xl text-center leading-tight font-bold text-white z-20"
            style={{
              textShadow:
                "0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6",
            }}
            variants={itemVariants}
          >
            {user.name}
          </motion.h1>
        </motion.div>

        {/* Tech Icons */}
        <motion.div
          className="absolute z-10 bg-[#2a2a2a] p-1 rounded-full text-cyan-400 text-6xl shadow-lg hover:scale-110 transition duration-300 ease-in-out"
          style={{ top: "-9%", right: "35%" }}
          variants={itemVariants}
        >
          <SiNextdotjs />
        </motion.div>

        <motion.div
          className="absolute z-10 bg-[#2a2a2a] p-1 rounded-full text-cyan-400 text-7xl shadow-lg hover:scale-110 transition duration-300 ease-in-out"
          variants={itemVariants}
          style={{ top: "0%", left: "23%" }}
        >
          <SiMongodb />
        </motion.div>

        <motion.div
          className="absolute z-10 bg-[#2a2a2a] p-1 rounded-full text-yellow-400 text-5xl shadow-lg hover:scale-110 transition duration-300 ease-in-out"
          variants={itemVariants}
          style={{ bottom: "15%", left: "17%" }}
        >
          <SiExpress />
        </motion.div>

        <motion.div
          className="absolute z-10 bg-[#2a2a2a] p-1 rounded-full text-green-500 text-3xl shadow-lg hover:scale-110 transition duration-300 ease-in-out"
          variants={itemVariants}
          style={{ bottom: "12%", right: "22%" }}
        >
          <SiReact />
        </motion.div>

        <motion.div
          className="absolute z-10 bg-[#2a2a2a] p-1 rounded-full text-green-500 text-2xl shadow-lg hover:scale-110 transition duration-300 ease-in-out"
          style={{ top: "19%", right: "20%" }}
          variants={itemVariants}
        >
          <SiNodedotjs />
        </motion.div>

        <motion.div
          className="absolute z-1 bg-[#2a2a2a] p-1 rounded-full text-cyan-400 text-4xl shadow-lg hover:scale-110 transition duration-300 ease-in-out"
          style={{ bottom: "-5%", left: "39%" }}
          variants={itemVariants}
        >
          <SiMysql />
        </motion.div>
      </motion.div>
    </section>
  );
};
export default Banner;
