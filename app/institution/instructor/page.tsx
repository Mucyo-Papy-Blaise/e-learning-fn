import React from 'react';

const TeamPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Martin",
      role: "Founder & CEO",
      description: "Passionate about building innovative solutions that make a real difference. Sarah has over 10 years of experience in tech leadership and product development.",
      image: "https://via.placeholder.com/80x80/4A90E2/FFFFFF?text=SM",
      alt: "Sarah Martin"
    },
    {
      id: 2,
      name: "Nathan Santiago",
      role: "Engineering Manager",
      description: "Full-stack developer with expertise in scalable architecture. Nathan leads our engineering team with a focus on clean code and innovative solutions.",
      image: "https://via.placeholder.com/80x80/7B68EE/FFFFFF?text=NS",
      alt: "Nathan Santiago"
    },
    {
      id: 3,
      name: "Caroline King",
      role: "Product Designer",
      description: "Creative designer focused on user experience and interface design. Caroline brings beautiful, intuitive designs to life with attention to every detail.",
      image: "https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=CK",
      alt: "Caroline King"
    },
    {
      id: 4,
      name: "David Garcia",
      role: "Frontend Developer",
      description: "Specialist in modern web technologies and responsive design. David creates seamless user experiences across all devices and platforms.",
      image: "https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=DG",
      alt: "David Garcia"
    },
    {
      id: 5,
      name: "Lisa Williams",
      role: "Marketing Director",
      description: "Strategic marketing professional with a talent for brand storytelling. Lisa drives our growth initiatives and builds meaningful connections with our audience.",
      image: "https://via.placeholder.com/80x80/45B7D1/FFFFFF?text=LW",
      alt: "Lisa Williams"
    },
    {
      id: 6,
      name: "Christian Rogers",
      role: "Backend Developer",
      description: "Expert in server-side development and database optimization. Christian ensures our systems are robust, secure, and perform at scale.",
      image: "https://via.placeholder.com/80x80/96CEB4/FFFFFF?text=CR",
      alt: "Christian Rogers"
    },
    {
      id: 7,
      name: "Sofia Davis",
      role: "UX Researcher",
      description: "User experience researcher passionate about understanding user needs. Sofia conducts research that drives product decisions and improves user satisfaction.",
      image: "https://via.placeholder.com/80x80/FECA57/FFFFFF?text=SD",
      alt: "Sofia Davis"
    },
    {
      id: 8,
      name: "Benjamin Ward",
      role: "Data Scientist",
      description: "Analytics expert who transforms data into actionable insights. Benjamin helps drive strategic decisions through comprehensive data analysis and modeling.",
      image: "https://via.placeholder.com/80x80/FF9FF3/FFFFFF?text=BW",
      alt: "Benjamin Ward"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Meet Our Team
          </h1>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              {/* Member Image */}
              <div className="mb-4">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                />
              </div>

              {/* Member Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;