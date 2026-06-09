import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file || !role) {
      setError("Please upload a file and enter a role");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await axios.post(
        "https://resume-analyzer-backend-e1qv.onrender.com/analyze",
        formData
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray-900 p-8 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/10">

        {/* Title */}
        <h1 className="text-3xl mb-6 text-blue-400 text-center font-semibold tracking-wide">
          AI Resume Analyzer
        </h1>

        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4 w-full text-sm file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-500 file:text-white
          hover:file:bg-blue-600"
        />

        {/* Role Input */}
        <input
          type="text"
          placeholder="Enter role (e.g. frontend developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        />

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600 transition transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <p className="text-gray-400 mt-6 text-center">
            Upload a resume and analyze to see results
          </p>
        )}

        {/* Result Section */}
        {result && (
          <div className="mt-8 animate-fadeIn">

            {/* Role */}
            <h2 className="text-lg mb-2 text-blue-300">
              Role: {result.analysis.role}
            </h2>

            {/* Match Percentage */}
            <h2 className="text-xl mb-2">
              Match: {result.analysis.match_percentage}%
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 h-3 rounded mb-6">
              <div
                className="h-3 bg-blue-500 rounded transition-all duration-1000 ease-out"
                style={{
                  width: `${result.analysis.match_percentage}%`,
                }}
              />
            </div>

            {/* Detected Skills */}
            <h3 className="mb-2 text-green-400">
              Detected Skills
            </h3>

            <div className="flex flex-wrap gap-2 mb-6">
              {result.skills_detected.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm hover:scale-105 transition"
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </span>
              ))}
            </div>

            {/* Missing Skills */}
            <h3 className="mb-2 text-red-400">
              Missing Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {result.analysis.missing_skills.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm hover:scale-105 transition"
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </span>
              ))}
            </div>

          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Built by Mohammed Shahed Afrid Khan 
        </p>

      </div>
    </div>
  );
}

export default App;