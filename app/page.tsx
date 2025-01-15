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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    status: "To Do",
    role: "",
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  // Initialize tasks from localStorage
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
        setFilteredTasks(parsedTasks);
      }
    } catch (error) {
      console.error("Error reading tasks from localStorage:", error);
    }
  }, []);

  // Update localStorage when tasks change
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
      // Add new task
      setTasks([...tasks, formData]);
    } else {
      // Edit task
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = formData;
      setTasks(updatedTasks);
      setEditIndex(null);
    }

    // Reset form
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
      task.title.toLowerCase().includes(searchTerm) || task.role.toLowerCase().includes(searchTerm)
    );
    setFilteredTasks(results);
  };

  const handleAddTask = () => {
    setFormVisible(true);
    setEditIndex(null);
    setFormData({
      title: "",
      desc: "",
      status: "To Do",
      role: "",
    });
  };

  const handleEditTask = (index: number) => {
    // Find the original index of the task in the 'tasks' array from 'filteredTasks'
    const originalIndex = tasks.findIndex(
      (task) =>
        task.title === filteredTasks[index].title && task.role === filteredTasks[index].role
    );

    if (originalIndex !== -1) {
      const task = tasks[originalIndex];
      setEditIndex(originalIndex);
      setFormData(task);
      setFormVisible(true);
    } else {
      alert("Error finding the task for editing.");
    }
  };

  const handleDeleteTask = (index: number) => {
    // Find the original index of the task in the 'tasks' array
    const originalIndex = tasks.findIndex(
      (task) =>
        task.title === filteredTasks[index].title && task.role === filteredTasks[index].role
    );

    if (originalIndex !== -1) {
      setTasks(tasks.filter((_, i) => i !== originalIndex));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-100 font-sans text-gray-800 min-h-screen">
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
        {/* Task Section */}
        <section id="task-section">
          <h2 className="text-xl font-semibold mb-6 text-center">Task Management</h2>

          {/* Search Bar */}
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

          {/* Task Form */}
          {isFormVisible && (
            <form
              ref={formRef}
              className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mb-6"
              onSubmit={handleSaveTask}
            >
              <input
                name="title"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Task Name"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="desc"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Task Description"
                value={formData.desc}
                onChange={handleInputChange}
                required
              ></textarea>
              <select
                name="status"
                className="w-full p-3 border border-gray-300 rounded-lg"
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
                className="w-full p-3 border border-gray-300 rounded-lg"
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
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Save
              </button>
            </form>
          )}

          {/* Task List */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold">{task.title}</h3>
                <p>{task.desc}</p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <p>
                  <strong>Role:</strong> {task.role}
                </p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={() => handleEditTask(index)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
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
