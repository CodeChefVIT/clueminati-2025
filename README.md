<p align="center">
  <a href="https://www.codechefvit.com" target="_blank" rel="noreferrer">
    <img src="https://i.ibb.co/4J9LXxS/cclogo.png" width="160" alt="CodeChef-VIT" />
  </a>
</p>

<h2 align="center">Clueminati 3.0</h2>

<p>
  <strong>Clueminati 3.0</strong> is CodeChef VIT's annual treasure hunt event, back with its 3rd edition in <strong>2025</strong>.
  This web application enables seamless team creation, score tracking, and real-time leaderboard management—ensuring participants enjoy an engaging and competitive experience throughout the event.
</p>

<hr/>

<h3>🌐 Deploy</h3>
<p>
  <a href="https://clueminati.codechefvit.com" target="_blank" rel="noreferrer">
    https://clueminati.codechefvit.com
  </a>
</p>

<h3>⚙️ Tech Stack</h3>
<ul>
  <li><a href="https://nextjs.org" target="_blank" rel="noreferrer">Next.js</a></li>
  <li><a href="https://www.typescriptlang.org" target="_blank" rel="noreferrer">TypeScript</a></li>
  <li><a href="https://tailwindcss.com" target="_blank" rel="noreferrer">Tailwind CSS</a></li>
  <li><a href="https://react-hot-toast.com" target="_blank" rel="noreferrer">React Hot Toast</a></li>
  <li><a href="https://axios-http.com" target="_blank" rel="noreferrer">Axios</a></li>
  <li><a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">Shadcn</a></li>
  <li><a href="https://www.mongodb.com" target="_blank" rel="noreferrer">MongoDB</a></li>
</ul>

<h3>💡 Features</h3>
<ul>
  <li><strong>Home Page</strong> — central hub for navigation and quick access to event features.</li>
  <li><strong>Scanner Page</strong> — scan QR codes to fetch questions during the treasure hunt.</li>
  <li><strong>Questions Page</strong> — view, attempt, and submit answers to event questions.</li>
  <li><strong>Admin Dashboard</strong> — manage teams, monitor scores, and update the leaderboard.</li>
  <li><strong>Team Management</strong> — participants can easily create or join teams.</li>
  <li><strong>Dynamic Leaderboard</strong> — real-time ranking updates for all teams.</li>
  <li><strong>Responsive Design</strong> — optimized for all devices and screen sizes.</li>
</ul>

<h3>🖼 Screenshots</h3>
<table>
  <tr>
    <td align="center">
      <img src="public/ss/login-page.png" alt="Login" width="300" />
      <br/><p>Login Page</p>
    </td>
    <td align="center">
      <img src="public/ss/join-team.png" alt="Join Team" width="300" />
      <br/><p>Join Team</p>
    </td>
    <td align="center">
      <img src="public/ss/create-team.png" alt="Create Team" width="300" />
      <br/><p>Create Team</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/ss/region-selection.png" alt="Home" width="300" />
      <br/><p>Home</p>
    </td>
   <td align="center">
      <img src="public/ss/home-page.png" alt="Home" width="300" />
      <br/><p>Home</p>
    </td>
    <td align="center">
      <img src="public/ss/leaderboards-page.png" alt="Leaderboard" width="300" />
      <br/><p>Leaderboard</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/ss/profile-page.png" alt="Profile" width="300" />
      <br/><p>Profile</p>
    </td>
    <td align="center">
      <img src="public/ss/scanner-page.jpeg" alt="Leaderboard" width="300" />
      <br/><p>Scanner</p>
    </td>
    <td align="center">
      <img src="public/ss/question-page.jpeg" alt="Profile" width="300" />
      <br/><p>Questions</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/ss/admin-page.png" alt="Admin Dashboard" width="300" />
      <br/><p>Admin Dashboard</p>
    </td>
  </tr>
</table>

<h3>🏁 Getting Started</h3>

<ol>
  <li>
    <p><strong>Clone the repository</strong></p>
    <pre><code>git clone -b main https://github.com/CodeChefVIT/clueminati-2025
    clueminati-2025.git
cd clueminati-portal-3.0</code></pre>
  </li>

  <li>
    <p><strong>Install dependencies</strong></p>
    <pre><code>pnpm i</code></pre>
  </li>

  <li>
    <p><strong>Set up environment variables</strong></p>
    <pre><code>cp .env.example .env</code></pre>
    <p>Update the values in <code>.env</code> (especially your MongoDB connection URI).</p>
  </li>

  <li>
    <p><strong>Database setup (MongoDB)</strong></p>
    <p>Ensure your <code>MONGODB_URI</code> (or equivalent) points to your MongoDB/Atlas instance. Create any required indexes/seed data if your app provides scripts.</p>
    <!-- If you have scripts, uncomment and customize:
    <pre><code>pnpm db:seed
pnpm db:index</code></pre>
    -->
  </li>

  <li>
    <p><strong>Run the development server</strong></p>
    <pre><code>pnpm dev</code></pre>
  </li>
</ol>

<h3>📝 Notes</h3>
<ul>
  <li>To access admin APIs, set the user role as <code>admin</code> in the database.</li>
  <li>API documentation: <a href="https://documenter.getpostman.com/view/25706513/2sAXqp83bu" target="_blank" rel="noreferrer">Postman Docs</a>.</li>
</ul>

<h3>🚀 Contributors</h3>

<table>
  <tr align="center">
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/110464184?v=4" width="200" height="200" alt="Harshit Kashyap Sharma" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Harshit Kashyap Sharma</p>
      <p align="center">
        <a href="https://github.com/kashyap-harshit">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/195720773?v=4" width="200" height="200" alt="Ayman Raza" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Ayman</p>
      <p align="center">
        <a href="https://github.com/Dragon-Rage">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/184590869?v=4" width="200" height="200" alt="Narendra Sadhukhan" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Narendra Sadhukhan</p>
      <p align="center">
        <a href="https://github.com/naren06-afk">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/narendrasadhukhan/">
          <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
        </a>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/174669430?v=4" width="200" height="200" alt="Hardik" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Hardik</p>
      <p align="center">
        <a href="https://github.com/sofaspawn">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/hardik-492338317/">
          <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
        </a>
      </p>
    </td>
  </tr>
  <tr align="center">
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/118340787?v=4" width="200" height="200" alt="Sajith M" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Sajith M</p>
      <p align="center">
        <a href="https://github.com/Sajith-13">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/174238080?v=4" width="200" height="200" alt="Harsheta Bhardwaj" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Harsheta Bhardwaj</p>
      <p align="center">
        <a href="https://github.com/harsheta-6">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/144542509?v=4" width="200" height="200" alt="Rohith JN" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Rohith JN</p>
      <p align="center">
        <a href="https://github.com/Rohith-JN">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/rohithnambiar/">
          <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
        </a>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/128321388?v=4" width="200" height="200" alt="Sanjana Shyamsundar" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Sanjana Shyamsundar</p>
      <p align="center">
        <a href="https://github.com/Skywalker-organa">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/sanjana-shyamsundar-156180332/">
          <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
        </a>
      </p>
    </td>
  </tr>
  <tr align="center">
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/174238080?v=4" width="200" height="200" alt="Rupesh Tripathi" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Rupesh Tripathi</p>
      <p align="center">
        <a href="https://github.com/rupeshhh007">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/rupesh-tripathi-b62583328/">
          <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
        </a>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/67090539?v=4" width="200" height="200" alt="Abhinav" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Abhinav</p>
      <p align="center">
        <a href="https://github.com/abhitrueprogrammer">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/abhinav-pant/">
          <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
        </a>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/155614230?v=4" width="200" height="200" alt="Soham Maha" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Soham Mahapatra</p>
      <p align="center">
        <a href="https://github.com/Soham-Maha">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/soham-mahapatra-433bb428a/">
          <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
        </a>
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://avatars.githubusercontent.com/u/142434600?v=4" width="200" height="200" alt="Samya Mehta" style="border:2px solid grey;border-radius:8px;">
      </p>
      <p style="font-size:17px;font-weight:600;">Samya Mehta</p>
      <p align="center">
        <a href="https://github.com/samyamehta16">
          <img src="http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height="36" alt="GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/samyamehta16/">
          <img src="http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
        </a>
      </p>
    </td>
  </tr>
</table>

<h3>📜 License</h3>
<p>This project is licensed under the <a href="http://badges.mit-license.org" target="_blank" rel="noreferrer">MIT License</a>.</p>

<p align="center">
  Made by <a href="https://www.codechefvit.com" target="_blank" rel="noreferrer">CodeChef-VIT</a>
</p>
