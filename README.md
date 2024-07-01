# Google Chat to Google Drive Exporter

## Description
This Google Apps Script is designed to export chats from Google Chat to Google Drive. The script automates the extraction of chat data and saves it securely to Drive, facilitating backups and archiving of important conversations.

## Current Status
**Note**: As of now, this script is in a developmental stage and does not fully function as intended. It requires additional configuration and access setup, specifically within Google Cloud Platform (GCP), to operate correctly. Users are welcome to explore the code, suggest improvements, or contribute to development.

## Features
- Automatically exports Google Chat conversations to Google Drive.
- Configures through `appsscript.json` for easy setup and deployment.
- Utilizes OAuth scopes for secure access to Google services.

## Setup
To set up this script in your Google Apps Script environment:
1. Clone this repository to your local machine.
2. Open Google Apps Script and select `New Project`.
3. Copy the contents of `chatToDrive.gs` and `appsscript.json` into the new project.
4. Adjust the `appsscript.json` for any specific configurations you might need.

## Getting Involved
We are actively seeking contributions to bring this project to full functionality. If you have experience with Google Apps Script and GCP, your input would be greatly appreciated. Please see the [Contributing](#contributing) section for more details on how to get involved.

## Configuration
Ensure the following scopes are enabled in your Google Cloud Platform project to use this script:
- `https://www.googleapis.com/auth/chat.bot`
- `https://www.googleapis.com/auth/drive`

## Usage
Run the script within the Google Apps Script editor to start exporting your chats. You can set up triggers to run this script automatically at regular intervals.

## Contributing
Contributions are welcome! Please fork this repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License, see the LICENSE file for more details.