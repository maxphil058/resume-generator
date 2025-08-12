"use client"

import { Download, CheckCircle, Copy } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import Loading from "../components/Loading"
import { useRef } from "react"
import pdfWorker from '../pdfWorker'; 
import * as pdfjsLib from 'pdfjs-dist';

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";


pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();





export default function Result() {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const  textAreaRef = useRef(null);
  const resumeContent = localStorage.getItem("updatedResume");
  
  const resumeString = `
John Doe
San Francisco, CA | john.doe@email.com | (123) 456-7890 | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe | Portfolio: johndoe.dev

---

**EDUCATION**
University of California, Berkeley – Berkeley, CA
Bachelor of Science in Computer Science | Aug 2020 – May 2024
- Relevant Coursework: Data Structures, Algorithms, Database Systems, Cloud Computing

---

**TECHNICAL SKILLS**
Languages: Python, JavaScript, Java, SQL
Frameworks & Libraries: React, Node.js, Express, Django
Tools & Platforms: Git, Docker, AWS (EC2, S3), Jenkins
Databases: PostgreSQL, MongoDB, Firebase

---

**EXPERIENCE**
Software Engineer Intern – TechCorp, San Francisco, CA | Jun 2023 – Aug 2023
- Developed a RESTful API using Node.js & Express, improving backend response time by 35% and reducing server costs by $8K/year.
- Automated CI/CD pipelines with Jenkins & Docker, cutting deployment time from 2 hours to 15 minutes and reducing errors by 40%.

IT Support Specialist – UniSolutions, Berkeley, CA | Jan 2022 – May 2023
- Resolved 300+ technical tickets monthly, improving system uptime from 95% to 99.5% through proactive debugging.
- Trained 15+ staff members on cybersecurity best practices, reducing phishing incidents by 60% in 6 months.

---

**PROJECTS**
E-Commerce Dashboard | React, Firebase, Stripe API | Jan 2024 – Mar 2024
- Built a real-time analytics dashboard handling 5,000+ monthly users, boosting merchant sales insights by 25%.
- Integrated Stripe API for secure payments, processing $50K+ transactions with 99.9% uptime.

ML-Based Fraud Detector | Python, Scikit-learn, AWS Lambda | Sep 2023 – Dec 2023
- Engineered a fraud detection model with 92% accuracy, reducing false positives by 30% and saving $15K/yr in losses.
- Deployed on AWS Lambda, scaling to process 10K+ transactions/day with a 200ms latency.

---

**CERTIFICATIONS**
- AWS Certified Cloud Practitioner – Amazon Web Services | May 2023
- Google Data Analytics Professional Certificate – Coursera | Dec 2022

---

**LEADERSHIP & ACTIVITIES**
- Lead Organizer – Hack the Future Hackathon | 2023 (200+ participants)
- Mentor – CS Tutoring Center, UC Berkeley | 2022 – 2023 (50+ students coached)
`;




  const handleCopy = async () => {
    try {

      const content = textAreaRef.current.value
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  


// start

// ONE function you call like: handleDownload("pdf") | handleDownload("docx") | handleDownload("txt")
const handleDownload = async (format) => {
  const content = textAreaRef.current?.value ?? "";
  const filenameBase = "tailored-resume";

  // helper: download any Blob
  const downloadBlob = (blob, name) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  // ---- make a REAL PDF from plain text (simple line-by-line; preserves \n) ----
  async function textToPDFBlob(text) {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const margin = 50;
    const fontSize = 12;
    const lineHeight = fontSize * 1.4;

    // start with first page
    let page = pdf.addPage();
    let { width, height } = page.getSize();
    let y = height - margin;

    const lines = text.replace(/\r/g, "").split("\n");
    for (const ln of lines) {
      // new page if we run out of room
      if (y - lineHeight < margin) {
        page = pdf.addPage();
        ({ width, height } = page.getSize());
        y = height - margin;
      }
      page.drawText(ln, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
    }

    const bytes = await pdf.save();
    return new Blob([bytes], { type: "application/pdf" });
  }

  // ---- make a REAL DOCX from plain text (each line = paragraph) ----
  async function textToDOCXBlob(text) {
    const paragraphs = text.replace(/\r/g, "").split("\n").map(
      (ln) => new Paragraph({ children: [new TextRun(ln)] })
    );
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    return new Blob([blob], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  }

  let file;
  if (format === "pdf") {
    file = await textToPDFBlob(content);             //  real PDF bytes
  } else if (format === "docx") {
    file = await textToDOCXBlob(content);            // real DOCX bytes
  } else {
    file = new Blob([content], { type: "text/plain" }); // plain .txt
  }

  downloadBlob(file, `${filenameBase}.${format}`);
};


// end 



  if (!resumeContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Generating your resume..." />
      </div>
    )
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
                  
                  {/* <iframe src= {filePath||"http://localhost:8080/resume_sample.pdf"} width="100%" height="600px" className=" "></iframe> */}
                  <textarea ref={textAreaRef} name="" id="" cols="30" rows="50" className="w-full h-full bg-gray-50 rounded-lg p-4" value={resumeString }> </textarea>


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
                  onClick={()=>handleDownload("pdf")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  <Download size={20} className="mr-2" />
                  Download as PDF
                </button>
                <button
                  onClick={()=>handleDownload("docx")}
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
