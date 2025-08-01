import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function CreateJobModal({ onClose, onJobCreated }) {
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    workMode: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    deadline: "",
    description: "",
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem("jobDraft");
    if (savedDraft) {
      setForm(JSON.parse(savedDraft));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const fields = [
      "title",
      "companyName",
      "workMode",
      "jobType",
      "salaryMin",
      "salaryMax",
      "deadline",
      "description",
    ];

    for (const field of fields) {
      if (!form[field]?.trim()) {
        alert(`Field "${field}" is required.`);
        return;
      }
    }

    const min = Number(form.salaryMin);
    const max = Number(form.salaryMax);

    if (isNaN(min) || isNaN(max)) {
      alert("Salary must be valid numbers.");
      return;
    }

    if (min > max) {
      alert("Min salary cannot be greater than max salary.");
      return;
    }

    const job = {
      ...form,
      salaryMin: min,
      salaryMax: max,
      deadline: new Date(`${form.deadline}T00:00:00`),
      postedAt: new Date(),
    };

    try {
      if (!API) {
        console.error("Missing API base URL (VITE_API_URL)");
        alert("API config error. Check .env file.");
        return;
      }

      const res = await axios.post(`${API}/jobs`, job);
      console.log("Job created:", res.data);

      localStorage.removeItem("jobDraft");
      alert("Job published successfully.");
      onJobCreated();
      onClose();
    } catch (err) {
      console.error("Error creating job:", err);
      alert("Failed to publish job. Check console for details.");
    }
  };

  const handleDraft = () => {
    localStorage.setItem("jobDraft", JSON.stringify(form));
    alert("Draft saved locally.");
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-center z-10 p-4">
      <div className="w-full max-w-[848px] bg-white rounded-[16px] shadow-[0px_0px_24px_rgba(169,169,169,0.25)] p-6 md:p-10 space-y-6 relative max-h-screen overflow-y-auto">
        <h2 className="text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] font-bold text-center text-[#222]">
          Create Job Opening
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <Input
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          <Input
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
          />

          <Select
            label="Work Mode"
            name="workMode"
            value={form.workMode}
            onChange={handleChange}
            options={["Remote", "Onsite", "Hybrid"]}
          />
          <Select
            label="Job Type"
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            options={["FullTime", "PartTime", "Internship"]}
          />

          <Input
            label="Salary Min"
            name="salaryMin"
            value={form.salaryMin}
            onChange={handleChange}
            placeholder="₹0"
            type="number"
          />
          <Input
            label="Salary Max"
            name="salaryMax"
            value={form.salaryMax}
            onChange={handleChange}
            placeholder="₹12,00,000"
            type="number"
          />
          <Input
            label="Application Deadline"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            type="date"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[20px] font-semibold text-[#222]">
            Job Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Please share a description to let the candidate know more about the job role"
            className="w-full h-[169px] p-4 border border-[#BCBCBC] rounded-[10px] text-[16px] text-[#222]"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-4">
          <button
            onClick={handleDraft}
            className="w-full md:w-[232px] h-[59px] bg-white text-[#222] font-semibold text-[20px] rounded-[10px] shadow border border-[#222]"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="w-full md:w-[207px] h-[59px] bg-[#00AAFF] text-white font-semibold text-[20px] rounded-[10px]"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <div>
      <label className="block text-[20px] font-semibold text-[#222] mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-[58px] px-4 border border-[#BCBCBC] rounded-[10px] text-[16px] text-[#222]"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[20px] font-semibold text-[#222] mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-[58px] px-4 border border-[#BCBCBC] rounded-[10px] text-[16px] text-[#222]"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
