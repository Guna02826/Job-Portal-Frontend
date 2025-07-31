import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/Jobcard";
import CreateJobModal from "../components/CreateJobModal";

const API = import.meta.env.VITE_API_URL;

export default function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    workMode: "",
    type: "",
    maxSalary: 3000000,
  });

  const fetchJobs = () => {
    axios
      .get(`${API}/jobs`)
      .then((res) => {
        const parsed = res.data.map((job) => {
          if (
            typeof job.salaryMin === "number" &&
            typeof job.salaryMax === "number"
          ) {
            job.salaryAnnual = Math.round((job.salaryMin + job.salaryMax) / 2);
          } else {
            job.salaryAnnual = 0;
          }
          return job;
        });
        setJobs(parsed);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    return (
      (job.title?.toLowerCase() || "").includes(filters.title.toLowerCase()) &&
      (job.workMode?.toLowerCase() || "").includes(
        filters.workMode.toLowerCase()
      ) &&
      (job.jobType?.toLowerCase() || "").includes(filters.type.toLowerCase()) &&
      (job.salaryAnnual || 0) <= filters.maxSalary
    );
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Listings</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Create Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end mb-6 bg-white p-4 rounded-md shadow-sm">
        <input
          type="text"
          placeholder="Search By Job Title, Role"
          className="px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Preferred Work Mode"
          className="px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filters.workMode}
          onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
        />
        <input
          type="text"
          placeholder="Job type"
          className="px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 font-medium">
            Salary ≤ ₹{(filters.maxSalary / 100000).toFixed(1)} LPA
          </label>
          <input
            type="range"
            min="100000"
            max="5000000"
            step="100000"
            value={filters.maxSalary}
            onChange={(e) =>
              setFilters({ ...filters, maxSalary: Number(e.target.value) })
            }
            className="w-full accent-purple-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No jobs found.
          </p>
        )}
      </div>

      {showModal && (
        <CreateJobModal
          onClose={() => setShowModal(false)}
          onJobCreated={fetchJobs}
        />
      )}
    </div>
  );
}
