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
      setError("Backend might be sleeping. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    if (level === "Strong") return "text-green-400";
    if (level === "Intermediate") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">

        {/* Title */}
        <h1 className="text-3xl mb-2 text-center font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          AI Resume Analyzer
        </h1>

        <p className="text-center text-gray-400 text-sm mb-6">
          Upload your resume and get instant insights
        </p>

        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />

        {/* Role Input */}
        <input
          type="text"
          placeholder="Enter role (e.g. frontend developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 w-full py-2 rounded-lg hover:scale-[1.03] transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!result && !loading && !error && (
          <p className="text-gray-500 mt-6 text-center text-sm">
            Upload a resume to see analysis
          </p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 animate-fadeIn">

            {/* ❌ ERROR CASE */}
            {result.analysis?.error ? (
              <div className="text-center text-red-400">
                <p className="font-semibold">{result.analysis.error}</p>

                {/* Suggestions clickable */}
                {result.analysis.suggestions?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-400 text-sm">Did you mean:</p>
                    <div className="flex justify-center gap-2 mt-2 flex-wrap">
                      {result.analysis.suggestions.map((s: string) => (
                        <button
                          key={s}
                          onClick={() => setRole(s)}
                          className="px-3 py-1 text-sm bg-blue-500/20 border border-blue-500/30 rounded-full hover:bg-blue-500/40"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Role */}
                <h2 className="text-blue-300 mb-2">
                  Role: {result.analysis?.role}
                </h2>

                {/* Level */}
                <h2 className={`mb-2 font-semibold ${getLevelColor(result.analysis?.level)}`}>
                  Level: {result.analysis?.level}
                </h2>

                {/* Match */}
                <h2 className="text-xl mb-2 font-semibold">
                  Match Score: {result.analysis?.match_percentage ?? 0}%
                </h2>

                {/* Progress */}
                <div className="w-full bg-gray-800 h-3 rounded-full mb-6">
                  <div
                    className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${result.analysis?.match_percentage ?? 0}%`,
                    }}
                  />
                </div>

                {/* Required Skills */}
                <h3 className="text-green-400 text-sm mb-2">Matched Required Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(result.analysis?.matched_required_skills || []).map((s: string) => (
                    <span key={s} className="bg-green-500/10 px-3 py-1 rounded-full text-xs">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Optional Skills */}
                <h3 className="text-blue-400 text-sm mb-2">Matched Optional Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(result.analysis?.matched_optional_skills || []).map((s: string) => (
                    <span key={s} className="bg-blue-500/10 px-3 py-1 rounded-full text-xs">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Missing */}
                <h3 className="text-red-400 text-sm mb-2">Missing Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(result.analysis?.missing_skills || []).map((s: string) => (
                    <span key={s} className="bg-red-500/10 px-3 py-1 rounded-full text-xs">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Recommendations */}
                {(result.analysis?.recommendations || []).length > 0 && (
                  <>
                    <h3 className="text-yellow-400 text-sm mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {result.analysis.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="bg-yellow-500/10 px-3 py-2 rounded text-sm">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Built by Mohammed Shahed Afrid Khan
        </p>

      </div>
    </div>
  );
}

export default App;