export default function JobCard({ job }) {
  return (
    <div className="relative w-full h-[360px] bg-white rounded-2xl shadow-md p-4 overflow-hidden flex flex-col justify-between">
      <div className="absolute top-4 right-4 px-3 py-1 bg-[#B0D9FF] text-sm font-medium rounded-lg">
        24h Ago
      </div>

      <div className="w-20 h-20 bg-gradient-to-b from-[#FEFEFD] to-[#F1F1F1] border shadow rounded-xl flex items-center justify-center mb-3">
        <div
          className="w-16 h-16 bg-cover bg-center"
          style={{ backgroundImage: `url(${job.logo || "image.png"})` }}
        />
      </div>

      <h2 className="text-lg font-bold text-black truncate">{job.title}</h2>

      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <div className="flex items-center gap-1">
          <span>1-3 yr Exp</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{job.jobType}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{job.salaryMax / 100000} LPA</span>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-2 line-clamp-3">
        {job.description.split("\n").map((line, idx) => (
          <p key={idx}>• {line}</p>
        ))}
      </div>

      <button
        onClick={() => alert("Applied successfully.")}
        className="mt-4 bg-[#00AAFF] hover:bg-[#0099E5] text-white font-semibold py-2 rounded-lg w-full transition"
      >
        Apply Now
      </button>
    </div>
  );
}
