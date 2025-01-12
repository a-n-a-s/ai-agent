import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { initializeSocket, sendMsg, receiveMsg } from "../config/socket";
import { UserContext } from "../context/user.context.jsx";
import Markdown from "markdown-to-jsx";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Projects = () => {
  const location = useLocation();

  const [isSideOpen, setIsSideOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(location.state);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageBox = useRef();

  const { user } = useContext(UserContext);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/project/add-user", {
        projectId: location?.state?.projectId,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  function sendMessage() {
    sendMsg("project-msg", {
      message,
      sender: user,
    });
    setMessage((prevMessages) => [...prevMessages, { sender: user, message }]);
    setMessage("");
  }

  useEffect(() => {
    axios.get(`/project/get-project/${project?.projectId}`).then((res) => {
      setProject(res.data.project);
    });
    
    axios
    .get("/user/all")
    .then((res) => setUsers(res.data.users))
    .catch((err) => console.log(err));
    console.log(project._id)
    receiveMsg("project-msg", (data) => {
      
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);
  
  initializeSocket(project._id);
  function WriteAiMessage(message) {
    const messageObject = JSON.parse(message);
    console.log(messageObject)

    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
        <Markdown
          children={messageObject.answer || messageObject.function}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }
  console.log(messages)

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative min-w-96 bg-blue-100 flex flex-col h-screen">
        <header className="flex justify-between p-4 w-full bg-slate-100 absolute top-0">
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="flex items-center cursor-pointer hover:bg-blue-500 p-1"
          >
            <i className="ri-add-fill mr-1"></i>
            <p className="text-sm">Add colcaborator</p>
          </button>
          <button onClick={() => setIsSideOpen(!isSideOpen)}>
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="convo-area pt-14 pb-10 flex-grow flex flex-col relative h-full ">
          <div
            ref={messageBox}
            className="msg-box  flex-grow flex flex-col p-1 gap-1 overflow-auto h-4/5 "
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender._id === "ai" ? "max-w-80" : "max-w-52"
                } ${
                  msg.sender._id == user._id.toString() && "ml-auto"
                }  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
              >
                <small className="opacity-65 text-xs">{msg.sender.email}</small>
                <div className="text-sm">
                  {msg.sender._id === "ai" ? (
                    WriteAiMessage(msg.message)
                  ) : (
                    <p>{msg.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="inFie flex w-full absolute bottom-0">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type a message"
              className="p-2 px-4 border-none outline-none flex-grow "
            />
            <button
              onClick={sendMessage}
              className="flex-grow flex items-center justify-center bg-blue-500"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`absolute top-0 bg-slate-200  tranistion-all  ${
            isSideOpen ? "translate-x-0" : "-translate-x-full "
          } w-full h-full flex flex-col gap-2`}
        >
          <header className="flex justify-end p-4 bg-slate-300">
            <button onClick={() => setIsSideOpen(!isSideOpen)}>
              <i className="ri-close-fill text-lg"></i>
            </button>
          </header>
          <div className="flex flex-col gap-2">
            {project?.users?.map((user) => (
              <div className="user flex items-center gap-2 p-2 cursor-pointer hover:bg-slate-400 ">
                <div className=" w-10 h-10   p-2 bg-slate-300 rounded-full flex items-center justify-center">
                  <i className="ri-user-fill"></i>
                </div>
                <h1 className="text-lg font-semibold">{user?.email}</h1>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="left w-[80%] bg-blue-300"></section>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    Array.from(selectedUserId).indexOf(user._id) != -1
                      ? "bg-slate-200"
                      : ""
                  } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user?.email}</h1>
                </div>
              ))}
            </div>
            <button
              onClick={() => addCollaborators()}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Projects;
