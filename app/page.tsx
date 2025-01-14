"use client";

import { useState, useEffect, useRef } from "react";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

interface Task {
  title: string;
  desc: string;
  status: string;
  role: string;
}

export default function Home() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "Pawan Kumar", role: "Developer", bio: "Loves coding and coffee." },
    { name: "Rashmi Chaudhary", role: "Developer", bio: "Passionate about UI/UX." },
    { name: "Prem Raja Babu", role: "Project Manager", bio: "Ensures smooth workflow." },
  ]);

  const [tasks, setTasks] = useState<Task[]>(
    JSON.parse(localStorage.getItem("tasks") || "[]")
  );
  const [searchValue, setSearchValue] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    status: "To Do",
    role: "",
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const storedTeamMembers = localStorage.getItem("teamMembers");
    if (storedTeamMembers) {
      setTeamMembers(JSON.parse(storedTeamMembers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleSaveTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.desc || !formData.role) {
      alert("Please fill all fields!");
      return;
    }

    if (editIndex === null) {
      // Add new task if editIndex is null
      setTasks([...tasks, formData]);
    } else {
      // Edit existing task
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = formData;
      setTasks(updatedTasks);
      setEditIndex(null);
    }

    // Reset form and hide it after saving
    setFormData({
      title: "",
      desc: "",
      status: "To Do",
      role: "",
    });
    setFormVisible(false);
  };

  const handleSearch = () => {
    const searchTerm = searchValue.toLowerCase();
    const results = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.role.toLowerCase().includes(searchTerm)
    );
    setFilteredTasks(results);
  };

  const handleAddTask = () => {
    setFormVisible(true);
    setEditIndex(null); // Clear edit index to add a new task
    setFormData({
      title: "",
      desc: "",
      status: "To Do",
      role: "",
    }); // Reset the form data for a new task
  };

  const handleEditTask = (index: number) => {
    const task = tasks[index];
    setEditIndex(index); // Set the task index for editing
    setFormData({
      title: task.title,
      desc: task.desc,
      status: task.status,
      role: task.role,
    }); // Populate the form with task data for editing
    setFormVisible(true); // Show the form for editing
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gray-100 font-sans text-gray-800">
      <header className="flex justify-between items-center bg-green-600 text-white px-4 py-3 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">Team and Task Management</h1>
        <nav className="flex space-x-4">
          <button
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </nav>
      </header>

      <main className="p-6">
        <section id="team-section" className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-center">Meet the Team</h2>
          <div className="flex justify-center items-center mb-6 space-x-4">
            <input
              type="text"
              className="w-3/5 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search by task title or role..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-500"
            >
              Search
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-300"
                >
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p>
                    <strong>Role:</strong> {member.role}
                  </p>
                  <p>{member.bio}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-red-500">No team members available.</p>
            )}
          </div>
        </section>

        <section id="task-section">
          <h2 className="text-xl font-semibold mb-6 text-center">Task Management</h2>

          {/* Task Form */}
          {isFormVisible && (
            <form
              ref={formRef}
              className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mb-6"
              onSubmit={handleSaveTask}
            >
              <input
                name="title"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Task Name"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="desc"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Task Description"
                value={formData.desc}
                onChange={handleInputChange}
                required
              ></textarea>
              <select
                name="status"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                name="role"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Project Manager">Project Manager</option>
              </select>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"
              >
                Save
              </button>
            </form>
          )}

          {/* Task List */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-300"
              >
                <h3 className="text-lg font-bold">{task.title}</h3>
                <p>{task.desc}</p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <p>
                  <strong>Role:</strong> {task.role}
                </p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-400"
                  onClick={() => handleEditTask(index)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
                  onClick={() => handleDeleteTask(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
