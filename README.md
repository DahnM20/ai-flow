<p align="center">
  <img src="assets/header.png" alt="AI-Flow Logo" />
</p>

<p align="center">
  <em>Open-source tool to seamlessly connect multiple AI model APIs into repeatable workflows.</em>
</p>

<p align="center">
  <a href="https://docs.ai-flow.net/?ref=github"><img src="https://img.shields.io/badge/lang-English-blue.svg" alt="English"></a>
  <a href="https://docs.ai-flow.net/?ref=github"><img src="https://img.shields.io/badge/lang-French-blue.svg" alt="French"></a>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  <img src="https://img.shields.io/github/v/release/DahnM20/ai-flow">
  <a href="https://twitter.com/DahnM20"><img src="https://img.shields.io/twitter/follow/AI-Flow?style=social" alt="Follow on Twitter"></a>
</p>

<p align="center">
  <a href="https://ai-flow.net/?ref=github">🔗 Website</a> • 
  <a href="https://docs.ai-flow.net/?ref=github">📚 Documentation</a>
</p>

---

<div align="center">
  🎉🚀 Latest Release: v0.9.0 🚀🎉
  <br>
  New Nodes: Deepseek, OpenAI o3, StabilityAI API update
</div>

---

![AI-Flow Intro](assets/flow-example.png)

## Overview

**AI-Flow** is an open-source, user-friendly UI that lets you visually design, manage, and monitor AI-driven workflows by seamlessly connecting multiple AI model APIs (e.g., OpenAI, StabilityAI, Replicate, Claude, Deepseek).

## Features

- **Visual Workflow Builder:** Drag-and-drop interface for crafting AI workflows.
- **Real-Time Monitoring:** Watch your workflow execute and track results.
- **Parallel Processing:** Nodes run in parallel whenever possible.
- **Model Management:** Easily organize and manage diverse AI models.
- **Import/Export:** Share or back up your workflows effortlessly.

## Supported Models

- **Replicate:** LLaMa, Mistral, FaceSwap, InstantMesh, MusicGen, and more.
- **OpenAI:** GPT-4, GPT-4 Vision, GPT-3.5, TTS, o1, o3.
- **StabilityAI:** Stable Diffusion 3, SDXL, Stable Video Diffusion, plus additional tools.
- **Others:** Claude, Deepseek.

![Scenario Example](assets/flow-example-2.png)

## Open Source vs. Cloud

**AI-Flow** is fully open source and available under the MIT License, empowering you to build and run your AI workflows on your personal machine.

For those seeking enhanced functionality and a polished experience, **AI-Flow Pro** on our cloud platform ([app.ai-flow.net](https://ai-flow.net/?ref=github)) offers advanced features, including:

- **Subflows & Loops:** Create complex, nested workflows and iterate tasks effortlessly.
- **API-Triggered Flows:** Initiate workflows via API calls for seamless automation.
- **Integrated Services:** Connect with external services such as Google Search, Airtable, Zapier, and Make.
- **Simplified Interface:** Transform workflows into streamlined tools with an intuitive UI.

![Pro VS Open Source](assets/comparison-pro-vs-opensource-v2.png)

The cloud version builds upon the foundation of the open-source project, giving you more power and flexibility while still letting you use your own API keys.

## Installation

> **Note:** To unlock full functionality, AI-Flow requires S3-compatible storage (with proper CORS settings) to host resources. Without it, features like File Upload or nodes that rely on external providers (e.g., StabilityAI) may not work as expected. Also, set `REPLICATE_API_KEY` in your environment to use the Replicate node.

### Local Installation (Without Docker)

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/DahnM20/ai-flow.git
   cd ai-flow
   ```

2. **UI Setup:**

   ```bash
   cd packages/ui
   npm install
   ```

3. **Backend Setup:**

   ```bash
   cd ../backend
   poetry install
   ```

   - **Windows Users:**
     ```bash
     poetry shell
     pip install -r requirements_windows.txt
     ```

4. **Run the Application:**
   - Start the backend:
     ```bash
     poetry run python server.py
     ```
   - In a new terminal, start the UI:
     ```bash
     cd packages/ui
     npm start
     ```
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### Docker Installation

1. **Prepare Docker Compose:**

   - Navigate to the `docker` directory:
     ```bash
     cd docker
     ```
   - Update the `REPLICATE_API_KEY` in the YAML file.

2. **Launch with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
3. **Access the Application:**
   - Open [http://localhost:80](http://localhost:80) in your browser.
   - To stop, run:
     ```bash
     docker-compose stop
     ```

## Contributing

We welcome contributions! If you encounter issues or have feature ideas, please [open an issue](https://github.com/DahnM20/ai-flow/issues) or submit a pull request.

## License

This project is released under the [MIT License](LICENSE).
