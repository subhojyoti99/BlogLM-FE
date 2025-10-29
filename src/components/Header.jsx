import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Register from "../auth/Register";
import Login from "../auth/Login";
import logoSrc from "../assets/lexis2.png";

export default function Header() {

  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const handleLogout = () => {
    logout();
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  return (
    <>
      <header className="flex flex-wrap items-center justify-start px-6 py-2 border-b bg-white shadow-sm">
        {/* Left Logo */}
        <div className="basis-1/3 items-center">
          <img
            src={logoSrc}
            alt="Logo"
            className="h-10"
          />
        </div>
        
        {/* Center Nav Items */}
        <nav className="flex basis-1/3 items-center justify-center space-x-8 text-gray-700 font-medium">
          <a href="/" className="hover:text-blue-600">
            Home
          </a>
          <a href="/blogs" className="hover:text-blue-600">
            Blogs
          </a>
          <a href="#" className="hover:text-blue-600">
            Features
          </a>
          <a href="#" className="hover:text-blue-600">
            About
          </a>
        </nav>

        {/* Right User Info */}
        <div className="flex basis-1/3 items-center justify-end space-x-3">
          {user ? (
            <>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                alt="User Avatar"
                className="h-9 w-9 rounded-full border"
              />
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {showAuth && (
        authMode === 'login' ? (
          <Login
            onClose={() => setShowAuth(false)}
            switchToRegister={switchAuthMode}
          />
        ) : (
          <Register
            onClose={() => setShowAuth(false)}
            switchToLogin={switchAuthMode}
          />
        )
      )}
    </>
  );
}


// import { useState } from "react";
// import { useAuth } from "../auth/AuthContext";
// import Register from "../auth/Register";
// import Login from "../auth/Login";
// import logoSrc from "../assets/lexis.png";

// export default function Header() {

//   const { user, logout } = useAuth();
//   const [showAuth, setShowAuth] = useState(false);
//   const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

//   const handleLogout = () => {
//     logout();
//   };

//   const switchAuthMode = () => {
//     setAuthMode(authMode === 'login' ? 'register' : 'login');
//   };

//   return (
//     <>
//       <header className="flex flex-wrap items-center justify-start px-6 py-2 border-b bg-white shadow-sm">
//         {/* Left Logo */}
//         <div className="basis-1/3 items-center">
//           <img
//             src={logoSrc}
//             alt="Logo"
//             className="h-10"
//           />
//           {/* <span className="text-xl font-bold text-blue-600">AI Blog Generator</span> */}
//         </div>

//         {/* Center Nav Items */}
//         <nav className="flex basis-1/3 items-center justify-center space-x-8 text-gray-700 font-medium">
//           <a href="/" className="hover:text-blue-600">
//             Home
//           </a>
//           <a href="/blogs" className="hover:text-blue-600">
//             Blogs
//           </a>
//           <a href="#" className="hover:text-blue-600">
//             Features
//           </a>
//           <a href="#" className="hover:text-blue-600">
//             About
//           </a>
//         </nav>

//         {/* Right User Info */}
//         <div className="flex basis-1/3 items-center justify-end space-x-3">
//           {user ? (
//             <>
//               <img
//                 src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
//                 alt="User Avatar"
//                 className="h-9 w-9 rounded-full border"
//               />
//               <div className="h-6 w-px bg-gray-300" />
//               <div className="flex items-center space-x-2">
//                 <span className="font-medium text-gray-800">{user.name}</span>
//                 <button
//                   onClick={handleLogout}
//                   className="text-sm text-red-600 hover:text-red-800"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </>
//           ) : (
//             <button
//               onClick={() => setShowAuth(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Login
//             </button>
//           )}
//         </div>
//       </header>

//       {showAuth && (
//         authMode === 'login' ? (
//           <Login
//             onClose={() => setShowAuth(false)}
//             switchToRegister={switchAuthMode}
//           />
//         ) : (
//           <Register
//             onClose={() => setShowAuth(false)}
//             switchToLogin={switchAuthMode}
//           />
//         )
//       )}
//     </>
//   );
// }
