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
      setError("Failed to analyze resume. Backend may be sleeping.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray-900 p-8 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/10">

        {/* Title */}
        <h1 className="text-3xl mb-6 text-blue-400 text-center font-semibold">
          AI Resume Analyzer
        </h1>

        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4 w-full text-sm file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0 file:bg-blue-500 file:text-white"
        />

        {/* Role Input */}
        <input
          type="text"
          placeholder="Enter role (e.g. frontend developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-700"
        />

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 text-red-400 text-center">{error}</div>
        )}

        {/* Empty */}
        {!result && !loading && !error && (
          <p className="text-gray-400 mt-6 text-center">
            Upload a resume and analyze to see results
          </p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8">

            {/* ❌ ERROR RESPONSE */}
            {result.analysis?.error ? (
              <div className="text-red-400 text-center">
                <p className="font-semibold">{result.analysis.error}</p>
                {result.analysis.available_roles && (
                  <p className="text-sm mt-2 text-gray-400">
                    Try: {result.analysis.available_roles.join(", ")}
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* Role */}
                <h2 className="text-lg text-blue-300 mb-2">
                  Role: {result.analysis?.role}
                </h2>

                {/* Match */}
                <h2 className="text-xl mb-2">
                  Match: {result.analysis?.match_percentage ?? 0}%
                </h2>

                {/* Progress */}
                <div className="w-full bg-gray-800 h-3 rounded mb-6">
                  <div
                    className="h-3 bg-blue-500 rounded transition-all duration-1000"
                    style={{
                      width: `${result.analysis?.match_percentage ?? 0}%`,
                    }}
                  />
                </div>

                {/* Skills */}
                <h3 className="text-green-400 mb-2">Detected Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(result.skills_detected || []).map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-green-500/20 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Missing */}
                <h3 className="text-red-400 mb-2">Missing Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(result.analysis?.missing_skills || []).map(
                    (skill: string) => (
                      <span
                        key={skill}
                        className="bg-red-500/20 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>

                {/* Recommendations */}
                {(result.analysis?.recommendations || []).length > 0 && (
                  <>
                    <h3 className="text-yellow-400 mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {result.analysis.recommendations.map(
                        (rec: string, i: number) => (
                          <li
                            key={i}
                            className="bg-yellow-500/10 px-3 py-2 rounded text-sm"
                          >
                            {rec}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </>
            )}
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