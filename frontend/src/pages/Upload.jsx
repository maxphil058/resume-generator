"use client"

import { useState } from "react"
import { UploadIcon, FileText, Briefcase } from "lucide-react"
import mammoth from "mammoth";  
import { useNavigate } from "react-router-dom"
import Loading from "../components/Loading"

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from '../pdfWorker'; // or './pdfWorker'

// ✅ Use workerPort (not workerSrc)
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();


export default function Upload() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [submitActive,setSubmitActive] = useState(false)
  const navigate = useNavigate()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }


  const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async () => {
        try {
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          let text = "";
  
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item) => item.str);
            text += strings.join(" ") + "\n";
          }
  
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
  
      reader.readAsArrayBuffer(file);
    });
  };
  

  const extractTextFromDocx = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (err) {
          reject(err);
        }
      };
  
      reader.readAsArrayBuffer(file);
    });
  };
  
  



  const handleSubmit = async(e) => {
    e.preventDefault()
    // Handle form submission logic here
    if (!file || !jobDescription.trim()) {
      alert("Please upload a resume and provide a job description")
      return
    }
    
    let resumeText=""
    const filename= file.name.toLowerCase()

    if(filename.endsWith(".pdf")){
      resumeText= await extractTextFromPDF(file)
    }else if(filename.endsWith(".docx")){
      resumeText= await extractTextFromDocx(file)
    }else{
      alert("Unsupported file type. Please upload a PDF or DOCX file.")
      return
    }

    console.log("Extracted Resume Text:", resumeText);


  //  const test= {   "jobDescription": "We are seeking a Junior Full Stack Developer to join our growing technology team. The ideal candidate will have a foundational understanding of front-end and back-end technologies, with hands-on experience in JavaScript, React, Java, and SQL. Responsibilities include building and maintaining web applications, integrating REST APIs, and collaborating with cross-functional teams to deliver high-quality features. Candidates should have a passion for learning, strong problem-solving skills, and the ability to work in an Agile/Scrum environment.",   
  //     "resumeText": "PHIL MAXWELL-MGBUDEM\nWeb Developer Intern\n\n• OTTAWA, CANADA • maxw0090@algonquinlive.com • 416-732-8520\n\nPROFESSIONAL SUMMARY\nAspiring software developer with a passion for full-stack web development and a strong foundation in React, Java, JavaScript, SQL, and Firebase. Experienced in building scalable web applications, optimizing performance, and implementing responsive UI designs. Adept at problem-solving, debugging, and API integration to create seamless user experiences. Successfully freelanced as a web developer, delivering customized websites for various companies.\n\nLINKS\nLinkedIn: https://www.linkedin.com/philmaxwell-mgbudem\nGitHub: https://github.com/maxphil058\n\nSKILLS\nLanguages & Programming: Java, JavaScript, C#, Python, C++, TypeScript\nWeb Development: HTML5, CSS3, React, Tailwind CSS, Bootstrap, Node.js\nDatabase & Backend: SQL, MySQL, PostgreSQL, Firebase (Firestore & Auth), MongoDB\nFrameworks & Libraries: React, Express.js, jQuery\nSoftware Development Tools: Git, GitHub, Visual Studio, Eclipse, IntelliJ, VS Code\nTesting & Debugging: JUnit, Postman, DevTools\nAPIs & Integration: REST APIs, JSON, XML\nOther Technologies: Docker (basics), Linux Shell, Object-Oriented Programming (OOP), UML, Agile/Scrum\n\nEMPLOYMENT HISTORY\nFREELANCE WEB DEVELOPER\nRemote | 2023 - Present\n- Designed and developed responsive websites for multiple businesses, ensuring mobile-friendly and high-performance solutions.\n- Implemented front-end and back-end features, improving site functionality and user experience.\n- Collaborated with clients to deliver customized, SEO-optimized websites tailored to their business needs.\n- Utilized React, JavaScript, Firebase, and SQL to create modern, scalable web applications.\n\nWEB DEVELOPER INTERN\nE-Clinic & Diagnostic | Nigeria | Sep 2024 - Dec 2024\n- Collaborating on feature development and bug fixes for a healthcare web application.\n- Enhancing database performance through optimized SQL queries.\n- Learning modern web development practices under mentorship.\n\nWEB DEVELOPMENT ASSISTANT\nPoonshax Development | Abuja, Nigeria\n- Assisted in software architecture, increasing customer engagement.\n- Enhanced user interaction experience by customizing a customer management system.\n- Utilized SQL to automate data storage, optimizing data management.\n\nPROJECTS\nMOVIE FINDER & STREAMING APP\nReact, JavaScript, API Integration, Live Streaming\n- Developed a movie search platform that fetches live data from an external movie API.\n- Integrated a live-streaming partner website, allowing users to search and instantly stream movies.\n- Used Firebase for authentication and real-time updates.\n\nTASK MANAGER APP\nReact, Firebase, Tailwind CSS\n- Designed a real-time task manager with real-time updates and authentication.\n- Built an intuitive UI using Tailwind CSS, improving UX and accessibility.\n- Integrated Firebase for implementing CRUD operations for seamless task management.\n\nEDUCATION\nDIPLOMA IN COMPUTER PROGRAMMING\nAlgonquin College | Ottawa, Canada | Jan 2025 - Present\n\nDIPLOMA IN FULL STACK WEB DEVELOPMENT\nNational Institute of Information Technology | Abuja, Nigeria | Jan 2024 - Aug 2024" } 
  //   const {resumeText,jobDescription} = test;

    try{
      setSubmitActive(true)
      const response = await fetch("http://localhost:8080/api/jobDesc" , {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({resumeText, jobDescription})
      })

      if(!response.ok){
        throw new Error("Failed to generate tailored resume")
      }

      const data= await response.text()
      console.log(data);
      console.log("Test 1")
      if(data){
        localStorage.setItem("updatedResume", data);
        
        navigate("/result/")
      }else{
        alert("Failed to generate tailored resume. Please try again.")
      }
      setSubmitActive(false)
    }catch(error){

      console.error("Error:", error)
      alert("An error occurred while generating the tailored resume. Please try again.")
    }
  }


  if (submitActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Generating your resume..." />
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Resume</h1>
          <p className="text-lg text-gray-600">
            Upload your current resume and paste the job description to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <FileText className="text-emerald-600 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">Resume Upload</h2>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                dragActive ? "border-emerald-400 bg-emerald-50" : "border-gray-300 hover:border-emerald-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Drop your resume here, or click to browse"}
                </p>
                <p className="text-sm text-gray-500">PDF or DOCX files only</p>
              </div>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 cursor-pointer transition-colors duration-200"
              >
                Choose File
              </label>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Briefcase className="text-emerald-600 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm"
              required
            />
            <p className="mt-2 text-sm text-gray-500">Include the full job posting for best results</p>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!file || !jobDescription.trim()}
              className="px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Generate Tailored Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
