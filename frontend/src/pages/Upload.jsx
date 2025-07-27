"use client"

import { useState } from "react"
import { UploadIcon, FileText, Briefcase } from "lucide-react"
import mammoth from "mammoth";  
import { useNavigate } from "react-router-dom"

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from '../pdfWorker'; // or './pdfWorker'

// ✅ Use workerPort (not workerSrc)
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

export default function Upload() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [dragActive, setDragActive] = useState(false)
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

    try{

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

      
      navigate("/result/"+data)

    }catch(error){

      console.error("Error:", error)
      alert("An error occurred while generating the tailored resume. Please try again.")
    }
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
