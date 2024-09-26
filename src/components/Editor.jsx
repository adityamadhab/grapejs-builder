import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs-preset-webpage';

const GrapesJSEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      width: 'auto',
      dragMode: 'absolute', // Enable absolute positioning
      storageManager: {
        type: 'local',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
      },
      plugins: ['gjs-preset-webpage'],
      pluginsOpts: {
        'gjs-preset-webpage': {},
      },
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
          './customGrapesjsStyles.css',
        ],
      },
    });

    const addCustomBlocks = () => {
      editor.BlockManager.add('section', {
        label: '<div class="block-label">Section</div>',
        content: `
            <section class="py-10 px-6 bg-gray-100 text-center rounded-lg shadow-lg">
                <h2 class="text-3xl font-semibold text-gray-800">Modern Section</h2>
                <p class="text-gray-600 mt-2">Add your content here.</p>
            </section>
        `,
        category: 'Basic',
        attributes: { class: 'fa fa-th-large' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('text', {
        label: '<div class="block-label">Text</div>',
        content: '<p class="text-lg text-gray-700">Your customizable text here...</p>',
        category: 'Basic',
        attributes: { class: 'fa fa-font' },
        resizable: true,
        draggable: true,
      });

      editor.DomComponents.addType('resizable-text', {
        isComponent: el => el.tagName === 'H1' || el.tagName === 'P',
        model: {
          defaults: {
            resizable: {
              tl: 0, // top left
              tc: 0, // top center
              tr: 0, // top right
              cl: 1, // center left
              cr: 1, // center right
              bl: 0, // bottom left
              bc: 0, // bottom center
              br: 0  // bottom right
            },
            traits: [
              {
                type: 'number',
                name: 'font-size',
                label: 'Font Size',
                units: ['px', 'rem', 'em'],
                min: 1,
                max: 100
              }
            ]
          }
        }
      });

      editor.BlockManager.add('header', {
        label: '<div class="block-label">Header</div>',
        content: `
    <header class="bg-gradient-to-r from-green-400 to-blue-500 text-white text-center py-8">
      <h1 data-gjs-type="resizable-text" class="text-4xl font-bold">Welcome to My Website</h1>
      <p data-gjs-type="resizable-text" class="text-lg mt-2">A simple tagline to catch attention.</p>
    </header>
  `,
        category: 'Basic',
        attributes: { class: 'fa fa-header' },
        resizable: true,
        draggable: true,
      });


      editor.BlockManager.add('footer', {
        label: '<div class="block-label">Footer</div>',
        content: `
                  <footer class="bg-gray-800 text-white text-center py-6">
                    <p class="text-sm">© 2024 Your Company. All rights reserved.</p>
                    <nav>
                      <a href="#" class="text-white hover:underline mx-4">Privacy</a>
                      <a href="#" class="text-white hover:underline mx-4">Terms</a>
                      <a href="#" class="text-white hover:underline mx-4">Contact</a>
                    </nav>
                  </footer>
                `,
        category: 'Basic',
        attributes: { class: 'fa fa-align-center' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('testimonial', {
        label: '<div class="block-label">Testimonial</div>',
        content: `
                  <div class="bg-white p-6 shadow-lg rounded-lg text-center max-w-lg mx-auto">
                    <p class="italic text-gray-700">"This product changed my life! Highly recommended!"</p>
                    <p class="mt-4 text-gray-900 font-bold">John Doe, CEO of Company</p>
                  </div>
                `,
        category: 'Basic',
        attributes: { class: 'fa fa-quote-right' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('navbar', {
        label: '<div class="block-label">Navbar</div>',
        content: `
      <nav class="bg-white shadow-lg p-4">
        <div class="container mx-auto flex justify-between items-center">
          <!-- Logo -->
          <a href="#" class="text-xl font-bold text-gray-800">MyLogo</a>
  
          <!-- Links -->
          <div class="hidden md:flex space-x-4">
            <a href="#" class="text-gray-600 hover:text-blue-600">Home</a>
            <a href="#" class="text-gray-600 hover:text-blue-600">About</a>
            <a href="#" class="text-gray-600 hover:text-blue-600">Services</a>
            <a href="#" class="text-gray-600 hover:text-blue-600">Contact</a>
          </div>
  
          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button class="text-gray-600 focus:outline-none focus:text-gray-900">
              <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Mobile Menu -->
        <div class="mobile-menu hidden md:hidden mt-4">
          <a href="#" class="block text-gray-600 hover:text-blue-600">Home</a>
          <a href="#" class="block text-gray-600 hover:text-blue-600">About</a>
          <a href="#" class="block text-gray-600 hover:text-blue-600">Services</a>
          <a href="#" class="block text-gray-600 hover:text-blue-600">Contact</a>
        </div>
      </nav>
    `,
        category: 'Basic',
        attributes: { class: 'fa fa-bars' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('button', {
        label: '<div class="block-label">Button</div>',
        content: '<button class="bg-gradient-to-r from-blue-400 to-purple-600 text-white py-2 px-4 rounded-full hover:opacity-90">Click Me</button>',
        category: 'Basic',
        attributes: { class: 'fa fa-hand-pointer' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('image', {
        label: '<div class="block-label">Image</div>',
        content: {
          type: 'image',
          attributes: {
            src: 'https://via.placeholder.com/150',
            class: 'custom-image',
            style: 'position: absolute; top: 0; left: 0;',
          },
          activeOnRender: 1,
        },
        category: 'Basic',
        attributes: { class: 'fa fa-image' },
        resizable: {
          tl: 1,
          tc: 1,
          tr: 1,
          cl: 1,
          cr: 1,
          bl: 1,
          bc: 1,
          br: 1,
        },
        draggable: true
      });

      editor.BlockManager.add('form', {
        label: '<div class="block-label">Form</div>',
        content: `
          <form class="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <div class="mb-4">
              <label class="block text-gray-600 mb-2">Name:</label>
              <input type="text" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter your name">
            </div>
            <div class="mb-4">
              <label class="block text-gray-600 mb-2">Email:</label>
              <input type="email" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter your email">
            </div>
            <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Submit</button>
          </form>
        `,
        category: 'Forms',
        attributes: { class: 'fa fa-envelope' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('form-group', {
        label: '<div class="block-label">Form Group</div>',
        content: `
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Label:</label>
                    <input type="text" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter text">
                  </div>
                `,
        category: 'Forms',
        attributes: { class: 'fa fa-list-alt' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('text-input', {
        label: '<div class="block-label">Text Input</div>',
        content: `
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Text Input:</label>
                    <input type="text" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter text">
                  </div>
                `,
        category: 'Forms',
        attributes: { class: 'fa fa-i-cursor' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('email-input', {
        label: '<div class="block-label">Email Input</div>',
        content: `
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Email Address:</label>
                    <input type="email" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter your email">
                  </div>
                `,
        category: 'Forms',
        attributes: { class: 'fa fa-envelope' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('password-input', {
        label: '<div class="block-label">Password Input</div>',
        content: `
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input type="password" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter your password">
                  </div>
                `,
        category: 'Forms',
        attributes: { class: 'fa fa-key' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('text-area', {
        label: '<div class="block-label">Text Area</div>',
        content: `
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Text Area:</label>
                    <textarea class="form-textarea bg-gray-50 rounded-md px-4 py-2 border border-gray-300" rows="4" placeholder="Enter text"></textarea>
                  </div>
                `,
        category: 'Forms',
        attributes: { class: 'fa fa-paragraph' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('checkbox', {
        label: '<div class="block-label">Checkbox</div>',
        content: `
                  <div class="mb-4">
                    <label class="inline-flex items-center">
                      <input type="checkbox" class="form-checkbox text-blue-500">
                      <span class="ml-2">Agree to terms and conditions</span>
                    </label>
                  </div>
                `,
        category: 'Forms',
        attributes: { class: 'fa fa-check-square' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('radio', {
        label: '<div class="block-label">Radio Button</div>',
        content: `
                  <div class="mb-4">
                    <label class="inline-flex items-center">
                      <input type="radio" name="option" class="form-radio text-blue-500">
                      <span class="ml-2">Option 1</span>
                    </label>
                    <label class="inline-flex items-center ml-4">
                      <input type="radio" name="option" class="form-radio text-blue-500">
                      <span class="ml-2">Option 2</span>
                    </label>
                  </div>
                `,
        category: 'Forms',
        attributes: { class: 'fa fa-dot-circle' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('submit-button', {
        label: '<div class="block-label">Submit Button</div>',
        content: `
                  <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Submit
                  </button>
                `,
        category: 'Forms',
        attributes: { class: 'fa fa-paper-plane' },
        resizable: true,
        draggable: true,
      });

      editor.BlockManager.add('columns', {
        label: '<div class="block-label">Columns</div>',
        content: `
          <div class="grid grid-cols-3 gap-4 p-4 bg-white shadow-md rounded-lg">
            <div class="col-span-1 bg-gray-50 p-4 rounded-md">Column 1</div>
            <div class="col-span-1 bg-gray-50 p-4 rounded-md">Column 2</div>
            <div class="col-span-1 bg-gray-50 p-4 rounded-md">Column 3</div>
          </div>
        `,
        category: 'Layout',
        attributes: { class: 'fa fa-columns' },
        resizable: true,
        draggable: true,
      });
    };

    editor.CssComposer.addRules(`
          /* Custom Block Styling */
          .block-label {
              text-align: center;
              padding: 10px;
              font-weight: bold;
              font-size: 14px;
              background-color: #113F72; /* Updated background color */
              border-radius: 6px;
              margin-bottom: 10px;
              color: #ffffff; /* White text color for better contrast */
          }
      
          .gjs-block:hover .block-label {
              background-color: #0D2C4E; /* Darker hover color */
          }
      
          /* Custom Image Styling */
          .custom-image:hover {
              opacity: 0.9;
              transition: opacity 0.3s ease-in-out;
          }
      
          /* Sidebar Customization */
          .gjs-pn-views-container,
          .gjs-pn-views {
              background-color: #113F72 !important; /* Updated panel background color */
              color: #ffffff; /* White text for better visibility */
              border: none;
          }
      
          .gjs-pn-views button {
              background-color: #0D2C4E !important; /* Updated button background color */
              color: #ffffff; /* White text */
              border-radius: 4px;
              margin: 4px 0;
          }
      
          .gjs-pn-buttons .gjs-pn-btn {
              color: #f3f4f6 !important; /* Lighter color for button icons */
          }
      
          .gjs-pn-buttons .gjs-pn-btn:hover {
              background-color: #0D2C4E !important; /* Darker hover color */
              color: #ffffff !important;
          }
      
          /* Custom canvas styles */
          body, html {
              background-color: #f3f4f6;
          }
      
          /* Custom Button Styling */
          .gjs-block-category .gjs-block-category-title {
              background-color: #0D2C4E;
              color: #ffffff;
              padding: 5px;
              border-radius: 6px;
              margin-bottom: 5px;
              font-size: 16px;
              font-weight: bold;
          }
      
          /* Custom container for blocks */
          .gjs-block-container {
              padding: 10px;
              background-color: #113F72;
              border-radius: 8px;
          }
      
          /* Custom hover for block container */
          .gjs-block-container:hover {
              background-color: #0D2C4E;
          }
      
          /* Panel button hover customization */
          .gjs-pn-buttons button:hover {
              background-color: #0D2C4E !important;
              color: #ffffff !important;
          }
      
          /* Add custom padding and margin to elements */
          .custom-padding {
              padding: 20px;
          }
      
          .custom-margin {
              margin: 20px;
          }
      `);

    addCustomBlocks();

    editorRef.current = editor;

    return () => {
      editor.destroy();
    };
  }, []);

  return <div id="gjs"></div>;
};

export default GrapesJSEditor;
