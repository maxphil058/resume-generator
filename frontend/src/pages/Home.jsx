import { Link } from "react-router-dom"
import { ArrowRight, FileText, Zap, Target } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Resume<span className="text-emerald-600">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Turn any job post into a tailored resume
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Upload your resume and paste a job description. Our AI will create a perfectly tailored resume that matches
            the job requirements.
          </p>

          <Link
            to="/upload"
            className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Resume</h3>
            <p className="text-gray-600">Upload your existing resume in PDF or DOCX format</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paste Job Post</h3>
            <p className="text-gray-600">Add the job description you want to apply for</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Magic</h3>
            <p className="text-gray-600">Get a tailored resume optimized for the specific job</p>
          </div>
        </div>
      </div>
    </div>
  )
}
