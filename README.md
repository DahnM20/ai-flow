# AI Flow

AI Flow is a Open Source user-friendly UI application that allows you to easily connect multiple AI models together. It provides a visual interface for designing and orchestrating AI workflows.

## Features

- Drag-and-drop interface for designing AI workflows
- Connect multiple AI models
- Monitor the execution of AI workflows in real-time
- Easily manage and organize AI models
- Export and import AI workflows for sharing or backup purposes

## Installation (without Docker)

### Prerequisites

Before getting started, make sure you have the following dependencies installed on your system:

- Python (version X.X.X)
- Poetry (version X.X.X)
- Node.js (version X.X.X)

### Clone the Repository

1. Clone the repository: `git clone https://github.com/DahnM20/ai-flow.git`
2. Change to the project directory: `cd ai-flow`

### UI Dependencies
1. Go to the UI directory: `cd packages/ui`
2. Install dependencies: `npm install`
3. Launch the ui: `npm start`

### Backend Dependencies
1. Go to the UI directory: `cd packages/backend`
2. Install Python dependencies: `poetry install`

## Usage

1. Start the backend server: `cd backend && poetry run python server.py`
2. Start the ui application: `cd ui && npm start`
3. Open your browser and navigate to `http://localhost:3000`
4. Use the drag-and-drop interface to design your AI workflow
5. Connect AI models and define data flow between them
6. Click "Run" to execute the AI workflow
7. Monitor the execution progress and results in real-time


## 🐳 Docker

### Docker Compose

1. Go to the docker directory: `cd ./docker`
2. Update the .yml if needed for the PORTS
3. Launch `docker-compose up` or `docker-compose up -d`
4. Open your browser and navigate to `http://localhost:3000`
5. Use `docker-compose stop` when you want to stop the app. 

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.