import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context.jsx";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const createProject = (e) => {
    e.preventDefault();
    axios
      .post("/project/create", { name: projectName })
      .then((res) => {
        
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get("/project/all")
      .then((res) => setProjects(res.data.projects))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      
      <main>
        <div className="projects flex">
          <button
            onClick={() => setIsModalOpen(true)}
            className="project p-4 m-4 border border-slate-300 rounded-md hover:bg-slate-300"
          >
            New Project
            <i className="ri-link ml-2"></i>
          </button>

          {projects.map((project) => (
            <div
              key={project._id}
              className="project p-4 m-4 border border-slate-300 rounded-md hover:bg-slate-300 cursor-pointer"
              onClick={() =>
                navigate(`/project/${project._id}`, {
                  state: {
                    projectId: project._id,
                    projectName: project.name,
                    users: project.users,
                  },
                })
              }
            >
              <h1>{project.name}</h1>
              <div>
                <i className="ri-user-line ml-2"></i>
                <small>Collaborators : {project.users.length}</small>
              </div>
            </div>
          ))}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                <h2 className="text-xl mb-4">Create New Project</h2>
                <form onSubmit={createProject}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Project Name
                    </label>
                    <input
                      onChange={(e) => setProjectName(e.target.value)}
                      value={projectName}
                      type="text"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
