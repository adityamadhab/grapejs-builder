import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs-preset-webpage';
import 'grapesjs-blocks-basic';

const GrapesJSEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    // localStorage.removeItem('gjs-html');
    // localStorage.removeItem('gjs-css');
    // localStorage.removeItem('gjs-components');
    // localStorage.removeItem('gjs-styles');
    // localStorage.removeItem('');

    // Initialize GrapesJS editor
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      width: 'auto',
      plugins: ['gjs-preset-webpage', 'gjs-blocks-basic'],
      pluginsOpts: {
        'gjs-preset-webpage': {},
        'gjs-blocks-basic': {},
      },
      storageManager: {
        type: 'local',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
      },
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
          // Add any custom styles here
        ],
      },
      // Enable absolute positioning
      dragMode: 'absolute',
    });

    // Define a custom component type with resizable and draggable defaults
    editor.DomComponents.addType('resizable-component', {
      model: {
        defaults: {
          draggable: true,
          resizable: {
            updateTarget: (el, rect, options) => {
              const { width, height, top, left } = rect;
              el.style.width = `${width}px`;
              el.style.height = `${height}px`;
              el.style.left = `${left}px`;
              el.style.top = `${top}px`;
            },
            tl: 1, // Top left
            tc: 1, // Top center
            tr: 1, // Top right
            cl: 1, // Center left
            cr: 1, // Center right
            bl: 1, // Bottom left
            bc: 1, // Bottom center
            br: 1, // Bottom right
          },
          // Ensure position is absolute for draggable and resizable
          style: {
            position: 'absolute',
          },
        },
      },
    });

    // Add custom blocks
    const blockManager = editor.BlockManager;

    // Helper function to remove conflicting Tailwind classes
    const removeConflictingClasses = (classes) => {
      const conflictingClasses = ['w-full', 'max-w-lg', 'mx-auto', 'my-0'];
      return classes
        .split(' ')
        .filter((cls) => !conflictingClasses.includes(cls))
        .join(' ');
    };

    // Add your custom blocks using the 'resizable-component' type
    blockManager.add('section', {
      label: 'Section',
      content: {
        type: 'resizable-component',
        components: `
          <section class="${removeConflictingClasses(
            'py-10 px-6 bg-gray-100 text-center rounded-lg shadow-lg'
          )}">
            <h2 class="text-3xl font-semibold text-gray-800">Modern Section</h2>
            <p class="text-gray-600 mt-2">Add your content here.</p>
          </section>
        `,
      },
      category: 'Basic',
      attributes: { class: 'fa fa-th-large' },
    });

    blockManager.add('text', {
      label: 'Text',
      content: {
        type: 'resizable-component',
        components: `
          <p class="text-lg text-gray-700">Your customizable text here...</p>
        `,
      },
      category: 'Basic',
      attributes: { class: 'fa fa-font' },
    });

    blockManager.add('header', {
      label: 'Header',
      content: {
        type: 'resizable-component',
        components: `
          <header class="${removeConflictingClasses(
            'bg-gradient-to-r from-green-400 to-blue-500 text-white text-center py-8'
          )}">
            <h1 class="text-4xl font-bold">Welcome to My Website</h1>
            <p class="text-lg mt-2">A simple tagline to catch attention.</p>
          </header>
        `,
      },
      category: 'Basic',
      attributes: { class: 'fa fa-header' },
    });

    blockManager.add('footer', {
      label: 'Footer',
      content: {
        type: 'resizable-component',
        components: `
          <footer class="bg-gray-800 text-white text-center py-6">
            <p class="text-sm">© 2024 Your Company. All rights reserved.</p>
            <nav>
              <a href="#" class="text-white hover:underline mx-4">Privacy</a>
              <a href="#" class="text-white hover:underline mx-4">Terms</a>
              <a href="#" class="text-white hover:underline mx-4">Contact</a>
            </nav>
          </footer>
        `,
      },
      category: 'Basic',
      attributes: { class: 'fa fa-align-center' },
    });

    blockManager.add('testimonial', {
      label: 'Testimonial',
      content: {
        type: 'resizable-component',
        components: `
          <div class="bg-white p-6 shadow-lg rounded-lg text-center">
            <p class="italic text-gray-700">"This product changed my life! Highly recommended!"</p>
            <p class="mt-4 text-gray-900 font-bold">John Doe, CEO of Company</p>
          </div>
        `,
      },
      category: 'Basic',
      attributes: { class: 'fa fa-quote-right' },
    });

    blockManager.add('navbar', {
      label: 'Navbar',
      content: {
        type: 'resizable-component',
        components: `
          <nav class="bg-white shadow-lg p-4">
            <div class="flex justify-between items-center">
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
      },
      category: 'Basic',
      attributes: { class: 'fa fa-bars' },
    });

    blockManager.add('button', {
      label: 'Button',
      content: {
        type: 'resizable-component',
        components: `
          <button class="bg-gradient-to-r from-blue-400 to-purple-600 text-white py-2 px-4 rounded-full hover:opacity-90">Click Me</button>
        `,
      },
      category: 'Basic',
      attributes: { class: 'fa fa-hand-pointer' },
    });

    blockManager.add('image', {
      label: 'Image',
      content: {
        type: 'image',
        attributes: {
          src: 'https://via.placeholder.com/150',
        },
        // Extend the image component to include resizable and draggable properties
        model: {
          defaults: {
            ...editor.DomComponents.getType('image').model.prototype.defaults,
            draggable: true,
            resizable: {
              updateTarget: (el, rect, options) => {
                const { width, height, top, left } = rect;
                el.style.width = `${width}px`;
                el.style.height = `${height}px`;
                el.style.left = `${left}px`;
                el.style.top = `${top}px`;
              },
              tl: 1,
              tc: 1,
              tr: 1,
              cl: 1,
              cr: 1,
              bl: 1,
              bc: 1,
              br: 1,
            },
            style: {
              position: 'absolute',
            },
          },
        },
      },
      category: 'Basic',
      attributes: { class: 'fa fa-image' },
    });

    // Add form-related blocks
    blockManager.add('form', {
      label: 'Form',
      content: {
        type: 'resizable-component',
        components: `
          <form class="bg-white p-6 rounded-lg shadow-lg">
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
      },
      category: 'Forms',
      attributes: { class: 'fa fa-envelope' },
    });

    blockManager.add('form-group', {
      label: 'Form Group',
      content: {
        type: 'resizable-component',
        components: `
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Label:</label>
            <input type="text" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter text">
          </div>
        `,
      },
      category: 'Forms',
      attributes: { class: 'fa fa-list-alt' },
    });

    blockManager.add('text-input', {
      label: 'Text Input',
      content: {
        type: 'resizable-component',
        components: `
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Text Input:</label>
            <input type="text" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter text">
          </div>
        `,
      },
      category: 'Forms',
      attributes: { class: 'fa fa-i-cursor' },
    });

    blockManager.add('email-input', {
      label: 'Email Input',
      content: {
        type: 'resizable-component',
        components: `
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email Address:</label>
            <input type="email" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter your email">
          </div>
        `,
      },
      category: 'Forms',
      attributes: { class: 'fa fa-envelope' },
    });

    blockManager.add('password-input', {
      label: 'Password Input',
      content: {
        type: 'resizable-component',
        components: `
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input type="password" class="form-input bg-gray-50 rounded-md px-4 py-2 border border-gray-300" placeholder="Enter your password">
          </div>
        `,
      },
      category: 'Forms',
      attributes: { class: 'fa fa-key' },
    });

    blockManager.add('text-area', {
      label: 'Text Area',
      content: {
        type: 'resizable-component',
        components: `
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Text Area:</label>
            <textarea class="form-textarea bg-gray-50 rounded-md px-4 py-2 border border-gray-300" rows="4" placeholder="Enter text"></textarea>
          </div>
        `,
      },
      category: 'Forms',
      attributes: { class: 'fa fa-paragraph' },
    });

    blockManager.add('checkbox', {
      label: 'Checkbox',
      content: {
        type: 'resizable-component',
        components: `
          <div class="mb-4">
            <label class="inline-flex items-center">
              <input type="checkbox" class="form-checkbox text-blue-500">
              <span class="ml-2">Agree to terms and conditions</span>
            </label>
          </div>
        `,
      },
      category: 'Forms',
      attributes: { class: 'fa fa-check-square' },
    });

    blockManager.add('radio', {
      label: 'Radio Button',
      content: {
        type: 'resizable-component',
        components: `
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
      },
      category: 'Forms',
      attributes: { class: 'fa fa-dot-circle' },
    });

    blockManager.add('submit-button', {
      label: 'Submit Button',
      content: {
        type: 'resizable-component',
        components: `
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Submit
          </button>
        `,
      },
      category: 'Forms',
      attributes: { class: 'fa fa-paper-plane' },
    });

    blockManager.add('columns', {
      label: 'Columns',
      content: {
        type: 'resizable-component',
        components: `
          <div class="grid grid-cols-3 gap-4 p-4 bg-white shadow-md rounded-lg">
            <div class="col-span-1 bg-gray-50 p-4 rounded-md">Column 1</div>
            <div class="col-span-1 bg-gray-50 p-4 rounded-md">Column 2</div>
            <div class="col-span-1 bg-gray-50 p-4 rounded-md">Column 3</div>
          </div>
        `,
      },
      category: 'Layout',
      attributes: { class: 'fa fa-columns' },
    });

    // Ensure that any new component added is set to be resizable and draggable
    editor.on('component:add', (component) => {
      if (component.get('type') === 'resizable-component') {
        return; // Already has resizable and draggable set
      }

      if (component.is('image')) {
        // For images, we already set resizable in the block definition
        return;
      }

      if (!component.get('draggable')) {
        component.set('draggable', true);
      }

      if (!component.get('resizable')) {
        component.set('resizable', {
          updateTarget: (el, rect, options) => {
            const { width, height, top, left } = rect;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
          },
          tl: 1,
          tc: 1,
          tr: 1,
          cl: 1,
          cr: 1,
          bl: 1,
          bc: 1,
          br: 1,
        });
      }

      // Ensure position is absolute
      const style = component.getStyle();
      if (style.position !== 'absolute') {
        component.addStyle({ position: 'absolute' });
      }
    });

    // Update CSS when components are moved or resized
    editor.on('component:styleUpdate', (model) => {
      console.log('Component style updated:', model.get('style'));
    });

    // Update HTML when components are moved or resized
    editor.on('component:update', (component) => {
      console.log('Component updated', component);
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
    };
  }, []);

  return <div id="gjs"></div>;
};

export default GrapesJSEditor;