import { Brain, Code, Zap, Users } from "lucide-react"

export default function About() {
  const technologies = [
    { name: "React", description: "Modern frontend framework for building user interfaces" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework for rapid UI development" },
    { name: "OpenAI", description: "Advanced AI models for intelligent resume tailoring" },
    { name: "Spring Boot", description: "Robust backend framework for scalable applications" },
  ]

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our advanced AI analyzes job descriptions and optimizes your resume accordingly.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get your tailored resume in seconds, not hours of manual editing.",
    },
    {
      icon: Code,
      title: "Modern Technology",
      description: "Built with cutting-edge technologies for the best user experience.",
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description: "Designed with simplicity and effectiveness in mind for job seekers.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Resume<span className="text-emerald-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing the job application process with AI-powered resume tailoring
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Purpose Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Purpose</h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto"></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              ResumeAI was created to solve a common problem faced by job seekers: the time-consuming process of
              tailoring resumes for each job application. In today's competitive job market, a generic resume simply
              isn't enough.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our platform leverages advanced artificial intelligence to analyze job descriptions and automatically
              optimize your resume to match the specific requirements and keywords that employers are looking for.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              By combining your existing experience with the specific needs of each role, ResumeAI helps you stand out
              from the crowd and increase your chances of landing interviews.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ResumeAI?</h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-emerald-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built With Modern Technology</h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ResumeAI is built using cutting-edge technologies to ensure reliability, performance, and scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">{tech.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">Transform your job search with AI-powered resume tailoring</p>
            <a
              href="/upload"
              className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Upload Your Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
