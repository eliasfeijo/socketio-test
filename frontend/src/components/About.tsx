import React from "react";

const About = (): JSX.Element => (
  <div className="p-4">
    <h3 className="text-xl text-center">About</h3>
    <div>
      <h4 className="text-lg text-center pt-4">
        This site was made in a single night using the following technologies:
      </h4>
      <ul className="text-center pt-4 space-y-2">
        <li>
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            React
          </a>
          <br />
          <span className="text-gray-500">
            Using Functional Components and React Hooks
          </span>
        </li>
        <li>
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Tailwind CSS
          </a>{" "}
          +{" "}
          <a
            href="https://postcss.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            PostCSS 8
          </a>
          <br />
          <span className="text-gray-500">
            For rapid frontend development and easy styling
          </span>
        </li>
        <li>
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Node.js
          </a>
          <br />
          <span className="text-gray-500">Development environment</span>
        </li>
        <li>
          <a
            href="https://webpack.js.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Webpack 5
          </a>{" "}
          +{" "}
          <a
            href="https://babeljs.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Babel
          </a>
          <br />
          <span className="text-gray-500">
            Processes the code, execute build tasks, and bundles the JS
            Application to be able to run on web browsers
          </span>
        </li>
        <li>
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            TypeScript
          </a>
          <br />
          <span className="text-gray-500">
            Better JavaScript with type checking and modern syntax
          </span>
        </li>
      </ul>
    </div>
  </div>
);

export default About;
