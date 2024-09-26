import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css'; 
import 'grapesjs-preset-webpage';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './customGrapesjsStyles.css';

const WebBuilder = () => {
    const editorRef = useRef(null);

    useEffect(() => {
        const editor = grapesjs.init({
            container: '#gjs',
            height: '100vh',
            width: 'auto',
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
                    './customGrapesjsStyles.css', // Apply the custom CSS
                ],
            },
        });

        // Custom Blocks
        editor.BlockManager.add('section', {
            label: 'Section',
            content: `
                <section class="py-8 px-4 bg-blue-100">
                <h2 class="text-2xl font-bold text-center text-blue-900">New Section</h2>
                <p class="text-center text-blue-700 mt-4">Your content goes here.</p>
                </section>
            `,
            category: 'Basic',
        });

        editor.BlockManager.add('text', {
            label: 'Text',
            content: '<p class="text-blue-800">Insert your text here...</p>',
            category: 'Basic',
        });

        editor.BlockManager.add('button', {
            label: 'Button',
            content:
                '<button class="bg-blue-500 text-white py-2 px-4 rounded">Click Me</button>',
            category: 'Basic',
        });

        editor.BlockManager.add('image', {
            label: 'Image',
            content: {
                type: 'image',
                attributes: { src: 'https://via.placeholder.com/150' },
                activeOnRender: 1,
            },
            category: 'Basic',
        });

        editor.BlockManager.add('api-dynamic-block', {
            label: 'Product List',
            content: {
                type: 'dynamic',
                content: `
                <div class="api-block">
                  <h3>{{ title }}</h3>
                  <ul>
                    {{ #each items }}
                      <li>{{ this }}</li>
                    {{ /each }}
                  </ul>
                </div>
              `,
                script: function () {
                    const block = this;
                    const apiUrl = 'http://localhost:3000/api/data';

                    async function fetchData() {
                        try {
                            const response = await fetch(apiUrl);
                            const data = await response.json();

                            block.innerHTML = block.innerHTML
                                .replace('{{ title }}', data.title)
                                .replace('{{ #each items }}', '')
                                .replace('{{ /each }}', '')
                                .replace(/{{ this }}/g, () => {
                                    return data.items.map(item => `<li>${item}</li>`).join('');
                                });
                        } catch (error) {
                            console.error('Error fetching data:', error);
                            block.innerHTML = '<p>Error loading data</p>';
                        }
                    }

                    fetchData();

                    setInterval(fetchData, 60000);
                }
            },
            category: 'E-commerce',
            style: {
                '.api-block': {
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                }
            }
        });

        editor.BlockManager.add('api-product-list', {
            label: 'API Product List',
            content: `
              <div class="product-list">
                <h2 class="product-list-title">Our Products</h2>
                <button class="refresh-button">Refresh Products</button>
                <div class="product-grid"></div>
              </div>
            `,
            category: 'E-commerce',
            attributes: { class: 'fa fa-shopping-bag' },
        });

        editor.DomComponents.addType('api-product-list', {
            isComponent: el => el.classList && el.classList.contains('product-list'),
            model: {
                defaults: {
                    script: function () {
                        const productGrid = this.querySelector('.product-grid');
                        const refreshButton = this.querySelector('.refresh-button');
                        const apiUrl = 'http://localhost:3000/products';

                        async function fetchProducts() {
                            try {
                                const response = await fetch(apiUrl);
                                const products = await response.json();

                                productGrid.innerHTML = products.map(product => `
                        <div class="product-item" data-product-id="${product.id}">
                          <img class="product-image" src="${product.image}" alt="${product.name}">
                          <h3 class="product-name">${product.name}</h3>
                          <p class="product-description">${product.description}</p>
                        </div>
                      `).join('');
                            } catch (error) {
                                console.error('Error fetching products:', error);
                                productGrid.innerHTML = '<p>Error loading products</p>';
                            }
                        }

                        // Fetch products when the block is first added
                        fetchProducts();

                        // Refresh products when the button is clicked
                        refreshButton.addEventListener('click', fetchProducts);
                    },
                    traits: [
                        {
                            type: 'text',
                            name: 'api-url',
                            label: 'API URL',
                        },
                    ],
                },
            },
            view: {
                init() {
                    this.listenTo(this.model, 'change:traits', this.updateScript);
                },
                updateScript() {
                    const apiUrl = this.model.get('traits').where({ name: 'api-url' })[0].get('value');
                    if (apiUrl) {
                        const script = this.model.get('script');
                        const updatedScript = script.toString().replace(
                            /const apiUrl = '.*';/,
                            `const apiUrl = '${apiUrl}';`
                        );
                        this.model.set('script', Function(updatedScript));
                    }
                },
            },
        });

        // Add styles
        editor.CssComposer.addRules(`
            .product-list { padding: 20px; }
            .product-list-title { text-align: center; margin-bottom: 20px; }
            .refresh-button { display: block; margin: 0 auto 20px; padding: 10px 20px; }
            .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
            .product-item { border: 1px solid #ddd; padding: 10px; text-align: center; }
            .product-image { max-width: 100%; height: auto; }
            .product-name { margin: 10px 0; }
            .product-description { font-size: 0.9em; color: #666; }
          `);

        // Create a new category for form elements
        editor.BlockManager.getCategories().add({ id: 'forms', label: 'Form Elements' });

        // Enable resizing and dragging on form blocks
        const resizableDraggableSettings = {
            resizable: {
                tl: 1, // Top left
                tc: 1, // Top center
                tr: 1, // Top right
                cl: 1, // Center left
                cr: 1, // Center right
                bl: 1, // Bottom left
                bc: 1, // Bottom center
                br: 1, // Bottom right
            },
            draggable: true,
        };

        // Form Block
        editor.BlockManager.add('form', {
            label: 'Form',
            category: 'forms',
            content: `
    <form class="form">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  `,
            attributes: { class: 'fa fa-wpforms' },
            ...resizableDraggableSettings // Apply resizable and draggable to this block
        });

        // Input Box Block
        editor.BlockManager.add('input', {
            label: 'Input',
            category: 'forms',
            content: `
    <div class="form-group">
      <label for="input">Input:</label>
      <input type="text" id="input" name="input">
    </div>
  `,
            attributes: { class: 'fa fa-terminal' },
            ...resizableDraggableSettings
        });

        // Text Area Block
        editor.BlockManager.add('textarea', {
            label: 'Text Area',
            category: 'forms',
            content: `
    <div class="form-group">
      <label for="textarea">Text Area:</label>
      <textarea id="textarea" name="textarea"></textarea>
    </div>
  `,
            attributes: { class: 'fa fa-paragraph' },
            ...resizableDraggableSettings
        });

        // Button Block
        editor.BlockManager.add('button', {
            label: 'Button',
            category: 'forms',
            content: '<button class="button">Click me</button>',
            attributes: { class: 'fa fa-square' },
            ...resizableDraggableSettings
        });

        // Select Dropdown Block
        editor.BlockManager.add('select', {
            label: 'Select Dropdown',
            category: 'forms',
            content: `
    <div class="form-group">
      <label for="select">Select:</label>
      <select id="select" name="select">
        <option value="">Choose an option</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </select>
    </div>
  `,
            attributes: { class: 'fa fa-caret-square-o-down' },
            ...resizableDraggableSettings
        });

        // Radio Buttons Block
        editor.BlockManager.add('radio', {
            label: 'Radio Buttons',
            category: 'forms',
            content: `
    <div class="form-group">
      <label>Radio Buttons:</label>
      <div>
        <input type="radio" id="radio1" name="radio-group" value="1">
        <label for="radio1">Option 1</label>
      </div>
      <div>
        <input type="radio" id="radio2" name="radio-group" value="2">
        <label for="radio2">Option 2</label>
      </div>
      <div>
        <input type="radio" id="radio3" name="radio-group" value="3">
        <label for="radio3">Option 3</label>
      </div>
    </div>
  `,
            attributes: { class: 'fa fa-dot-circle-o' },
            ...resizableDraggableSettings
        });

        // Checkbox Block
        editor.BlockManager.add('checkbox', {
            label: 'Checkbox',
            category: 'forms',
            content: `
    <div class="form-group">
      <input type="checkbox" id="checkbox" name="checkbox">
      <label for="checkbox">Checkbox Label</label>
    </div>
  `,
            attributes: { class: 'fa fa-check-square' },
            ...resizableDraggableSettings
        });

        // Add some basic styles
        editor.CssComposer.addRules(`
  .form { max-width: 500px; margin: 0 auto; padding: 20px; }
  .form-group { margin-bottom: 15px; }
  label { display: block; margin-bottom: 5px; }
  input[type="text"], input[type="email"], textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
  textarea { height: 100px; }
  button { padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
  button:hover { background-color: #0056b3; }
`);

        editorRef.current = editor;

        return () => {
            editor.destroy();
        };
    }, []);

    const exportToReact = async () => {
        const editor = editorRef.current;
        const html = editor.getHtml();

        const jsxContent = convertHtmlToJsx(html);

        const zip = new JSZip();

        zip.file('package.json', JSON.stringify({
            name: "vite-react-app",
            version: "1.0.0",
            scripts: {
                dev: "vite",
                build: "vite build",
                preview: "vite preview"
            },
            dependencies: {
                react: "^18.0.0",
                "react-dom": "^18.0.0"
            },
            devDependencies: {
                vite: "^4.0.0",
                "@vitejs/plugin-react": "^2.0.0"
            }
        }, null, 2));

        zip.file('vite.config.js', `
            import { defineConfig } from 'vite';
            import react from '@vitejs/plugin-react';

            export default defineConfig({
                plugins: [react()],
            });
        `);

        zip.file('index.html', `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vite React App</title>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" src="/src/main.jsx"></script>
            </body>
            </html>
        `);

        zip.file('src/main.jsx', `
            import React from 'react';
            import ReactDOM from 'react-dom/client';
            import App from './App';
            import './index.css';

            ReactDOM.createRoot(document.getElementById('root')).render(
                <React.StrictMode>
                    <App />
                </React.StrictMode>,
            );
        `);

        zip.file('src/App.jsx', jsxContent);
        zip.file('src/index.css', '/* Add your CSS here */');

        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'vite-react-project.zip');
        });
    };

    const publishToVercel = async () => {
        const editor = editorRef.current;
        const html = editor.getHtml();
        const jsxContent = convertHtmlToJsx(html);

        const zip = new JSZip();

        zip.file('package.json', JSON.stringify({
            name: "vite-react-app",
            version: "1.0.0",
            scripts: {
                dev: "vite",
                build: "vite build",
                preview: "vite preview"
            },
            dependencies: {
                react: "^18.0.0",
                "react-dom": "^18.0.0"
            },
            devDependencies: {
                vite: "^4.0.0",
                "@vitejs/plugin-react": "^2.0.0"
            }
        }, null, 2));

        zip.file('vite.config.js', `
            import { defineConfig } from 'vite';
            import react from '@vitejs/plugin-react';

            export default defineConfig({
                plugins: [react()],
            });
        `);

        zip.file('index.html', `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vite React App</title>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" src="/src/main.jsx"></script>
            </body>
            </html>
        `);

        zip.file('src/main.jsx', `
            import React from 'react';
            import ReactDOM from 'react-dom/client';
            import App from './App';
            import './index.css';

            ReactDOM.createRoot(document.getElementById('root')).render(
                <React.StrictMode>
                    <App />
                </React.StrictMode>,
            );
        `);

        zip.file('src/App.jsx', jsxContent);
        zip.file('src/index.css', '/* Add your CSS here */');

        const zipContent = await zip.generateAsync({ type: 'blob' });

        const formData = new FormData();
        formData.append('file', zipContent, 'vite-react-project.zip');

        try {
            const response = await fetch('http://localhost:3000/deploy', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Deployment initiated! View your project at ${result.vercelProjectUrl}`);
            } else {
                alert(`Deployment failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Deployment error:', error);
            alert('Deployment failed. Please try again.');
        }
    };

    const convertHtmlToJsx = (html) => {
        let jsx = html
            .replace(/class=/g, 'className=')
            .replace(/for=/g, 'htmlFor=')
            .replace(/<br>/g, '<br />');

        jsx = `import React from 'react';
import 'tailwindcss/tailwind.css';

const App = () => (
  <>
    ${jsx}
  </>
);

export default App;
`;
        return jsx;
    };

    return (
        <div className="h-screen flex flex-col bg-blue-100">
            <header className="p-4 bg-blue-900 text-white flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">React Web Builder</h1>
                <div>
                    <button
                        onClick={exportToReact}
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mr-2 transition-colors duration-300"
                    >
                        Export to React
                    </button>
                    <button
                        onClick={publishToVercel}
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                    >
                        Publish
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-hidden border-t-4 border-blue-700 shadow-inner">
                <div id="gjs" className="h-full" />
            </div>
        </div>
    );
};

export default WebBuilder;