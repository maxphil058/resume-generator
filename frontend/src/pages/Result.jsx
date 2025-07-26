"use client"

import { Download, CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

export default function Result() {
  const [copied, setCopied] = useState(false)

  // Mock resume data - replace with actual AI-generated content
  const resumeContent = `John Doe
Software Engineer

CONTACT INFORMATION
Email: john.doe@email.com
Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe
Location: San Francisco, CA

PROFESSIONAL SUMMARY
Experienced Software Engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams to achieve project goals.

TECHNICAL SKILLS
• Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express.js, Python, Java, Spring Boot
• Databases: PostgreSQL, MongoDB, Redis
• Cloud: AWS, Docker, Kubernetes
• Tools: Git, Jenkins, Jira, Figma

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2021 - Present
• Led development of customer-facing web applications serving 100K+ users
• Implemented microservices architecture reducing system latency by 40%
• Mentored junior developers and conducted code reviews
• Collaborated with product managers to define technical requirements

Software Engineer | StartupXYZ | 2019 - 2021
• Developed responsive web applications using React and Node.js
• Integrated third-party APIs and payment processing systems
• Optimized database queries improving application performance by 25%
• Participated in agile development processes and sprint planning

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2019

PROJECTS
• E-commerce Platform: Built full-stack application with React and Express
• Task Management App: Developed mobile-responsive web app with real-time updates
• Open Source Contributor: Active contributor to popular JavaScript libraries`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resumeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement("a")
    const file = new Blob([resumeContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "tailored-resume.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-emerald-600" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Generated Successfully!</h1>
          <p className="text-lg text-gray-600">Your tailored resume has been created based on the job description</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Tailored Resume</h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                  >
                    <Copy size={16} className="mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-6 max-h-[60rem] overflow-y-auto ">
                  
                  <iframe src="http://localhost:8080/resume_sample.pdf" width="100%" height="600px" className=" "></iframe>


                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  <Download size={20} className="mr-2" />
                  Download as PDF
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download size={20} className="mr-2" />
                  Download as DOCX
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Review and customize the generated resume
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Download in your preferred format
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Apply to the job with confidence
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Pro Tip</h3>
              <p className="text-sm text-emerald-700">
                Always review the generated resume and make personal adjustments to ensure it accurately represents your
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
