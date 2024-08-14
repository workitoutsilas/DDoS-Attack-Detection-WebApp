# DDoS ATTACK DETECTION USING ML IN AN IoT ENVIRONMENT

This project implements a web application to classify traffic flows into DDoS and normal traffic patterns. 
Network administrators can upload traffic capture files (.csv) for predictions. The application leverages a machine learning model (Random Forest)  to make predictions,
and display the results.

Key Features:

- DDoS Traffic Classification: Identify potential DDoS attacks by analyzing traffic patterns.
- Web Interface: User-friendly interface for uploading traffic capture files in a specified format.
- Machine Learning Integration: Integrates a trained model for traffic classification into normal or malicious(DDoS).
- Visualization: Presents prediction results in an easy-to-understand format (using prediction probabilities).

## DDoS attacks considered

| Type                   | Description               |
|------------------------|---------------------------|
| DDoS-ICMP_Flood        | Description of this type  |
| DDoS-UDP_Flood         | Description of this type  |
| DDoS-TCP_Flood         | Description of this type  |
| DDoS-PSHACK_Flood      | Description of this type  |
| DDoS-SYN_Flood         | Description of this type  |
| DDoS-RSTFIN_Flood      | Description of this type  |
| DDoS-SynonymousIP_Flood| Description of this type  |
| DDoS-ICMP_Fragmentation| Description of this type  |
| DDoS-UDP_Fragmentation | Description of this type  |
| DDoS-ACK_Fragmentation | Description of this type  |
| DDoS-HTTP_Flood        | Description of this type  |
| DDoS-SlowLoris         | Description of this type  |

## DDoS Web App

This project has been deployed on render. Visit the app here, https://ddos-detection-app.onrender.com.

## Project Structure ( Without files for deployment on render )

- `for_deployment` - Name of repository / Contains all project files.
- `model/` - Random Forest and Support Vector Classifiers & scaler used for model training.
- `static/` - Contains static files such as CSS, JavaScript, and images.
- `templates/` - Contains HTML templates for the project.
- `VirtlEnv/` - Python virtual environment.
- `tryThis.py` - Flask app - Backend.

## Prerequisites - Run repo on IDE locally 

Ensure you have the following installed:

- Python 3.x
- pip (Python package installer)
- virtualenv (for creating a virtual environment)

## Setup Instructions

1. **Clone the repository**:

- git clone https://github.com/username/DDoS-Biggest-Backup.git
- cd Flask

2. **Create and activate a virtual environment**

- python -m venv VirtEnv
- source VirtEnv/bin/activate

3. **Install dependencies**:
   pip install -r requirements.txt

4. **Run the development server**:
   python3 app.py
