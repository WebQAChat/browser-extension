## A chrome browser extension that can answer your questions about a webpage

### Initial Setup for backend system (only need to do once):

-   Create a virtual environment to install packages

    -   `python -m venv venv`

-   Activate it (depending on your OS)

    -   Windows: `source venv/Scripts/activate`
    -   MacOS/ Unix: `source venv/bin/activate`

    Once you can see the name of your virtual environment—in this case (venv)—in your command prompt, then you know that your virtual environment is active. You’re all set and ready to install your external packages!

-   Install dependencies by `pip install -r requirements.txt`

    Read this if you want to learn more about virtual environments (https://realpython.com/python-virtual-environments-a-primer/)

### Running API Endpoint

See inside api/ folder.

### Making Pull Requests

If you need a reference: https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github

### Resources:

-   How to create a Chrome extension for GPT-3 questions with ReactJS: https://norahsakal.com/blog/create-gpt3-chrome-extension
-   This is an open source project: https://github.com/interstellard/chatgpt-advanced/tree/main/src
-   Django vs Fast API: A Detailed Comparison: https://medium.com/@ShortHills_Tech/django-vs-fast-api-a-detailed-comparison-df8d00f3c3b2
-   What are web sockets?: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
-   WebSocket vs REST: Key differences and which to use: https://ably.com/topic/websocket-vs-rest
-   Building a WebSocket Server With Python: https://www.piesocket.com/blog/python-websocket
-   A Guide to Building a Full-stack web app with llama index: https://gpt-index.readthedocs.io/en/latest/guides/tutorials/fullstack_app_guide.html
-   How to set up a virtual env in python: https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/
-   Llama Index Vector Stores: https://gpt-index.readthedocs.io/en/latest/core_modules/data_modules/storage/vector_stores.html
-   What is vector database: https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiq_eSr3KKAAxUmNEQIHXpiC90QFnoECBIQAQ&url=https%3A%2F%2Faws.amazon.com%2Fwhat-is%2Fvector-databases%2F&usg=AOvVaw0T2qmmSg1ibs7envwoCKqF&opi=89978449


## How to setup multiple builds
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings
To set up multiple builds (development, testing, and production) for both the frontend (browser extension) and the backend (server) effectively, follow these guidelines:

### Frontend (Browser Extension)
1. **Manifest Configuration**: Use separate `manifest.json` files for each environment. Modify permissions, `content_security_policy`, and other fields accordingly.
    - **Development**: Might have looser content security policies and more verbose logging.
    - **Testing**: Could point to a staging server.
    - **Production**: Should have strict content security policies and point to the production server.

2. **Versioning**: Maintain different versioning for builds to avoid confusion and to manage updates correctly.

3. **Build Scripts**: Implement build scripts in your project's package.json or a build tool configuration to automate the creation of each environment's build.
   - Use environment variables to switch between different configurations.
   - Tools like Webpack or Parcel can be configured to replace environment-specific details during the build process.

### Backend (FastAPI Server)
1. **Environment Configuration**: Use environment variables to configure different aspects like database URLs, CORS origins, and other sensitive settings.
   - You can use Python's `os` module to read environment variables and configure your application differently based on the current environment.

2. **CORS Setup**: Dynamically set CORS origins based on the environment.
   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   import os

   app = FastAPI()

   # Environment-specific CORS origins
   if os.getenv('ENV') == 'development':
       origins = ["moz-extension://dev-extension-id"]
   elif os.getenv('ENV') == 'testing':
       origins = ["moz-extension://test-extension-id"]
   elif os.getenv('ENV') == 'production':
       origins = ["moz-extension://prod-extension-id"]

   app.add_middleware(
       CORSMiddleware,
       allow_origins=origins,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Testing**: Ensure that your testing environment replicates the production environment as closely as possible, except for the use of test data.

4. **Deployment**: Use automated CI/CD pipelines to deploy your backend. Tools like GitHub Actions, Jenkins, or GitLab CI can help automate testing and deployment based on the branch or tags.

### General Tips
- **Version Control**: Use separate branches for development, testing, and production environments in your repository.
- **Documentation**: Maintain clear documentation for the setup and configuration of each environment.
- **Security**: Ensure that only necessary permissions are enabled for each environment, especially for production.

Setting up multiple environments helps isolate development efforts from user-facing production services, allowing safer tests and more stable releases.