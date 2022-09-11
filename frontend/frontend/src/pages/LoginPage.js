import { useRef, useState, useEffect } from 'react';


const Login = () => {
  const userRef = useRef();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }                                                                     
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');
  console.log("csrf", csrftoken);
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers : {
        "Content-Type": "application/json",
        // "X-CSRFToken": csrftoken,
      },
      // withCredentials: true,
      body: JSON.stringify({username: user, password: password})
    };
    const response = await fetch('http://127.0.0.1:8000/login', requestOptions);
    const data = await response.json();
    console.log("Data", data);

  }
  return (
    <section>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
          <label html="username">Username:</label>
          <input 
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button>Sign In</button>
      </form>
    </section>
  );
};

export default Login;
