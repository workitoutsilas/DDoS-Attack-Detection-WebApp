from flask import Flask, request, render_template, redirect, url_for, jsonify, session, g
import pandas as pd
import pickle
import os
from flask_session import Session

# Initialize the Flask app
tryThis = Flask(__name__)
tryThis.config['DEBUG'] = True
tryThis.secret_key = os.urandom(24)  # Set the secret key for session management

# Configure server-side session storage
tryThis.config['SESSION_TYPE'] = 'filesystem'
Session(tryThis)

# Load the trained model and scaler
model = pickle.load(open('./model/rf_model_manual.pkl', 'rb'))
scaler = pickle.load(open('./model/scaler.pkl', 'rb'))

@tryThis.route("/")
def index():
    return render_template('index.html')

@tryThis.route("/predict", methods=['POST'])
def predict():
    if 'file_upload' not in request.files:
        return jsonify(error="No file part"), 400

    my_file = request.files['file_upload']

    if my_file.filename == '':
        return jsonify(error="No selected file"), 400

    if my_file and my_file.filename.endswith('.csv'):
        df = pd.read_csv(my_file)

        required_columns = ['flow_duration', 'ICMP', 'Tot sum', 'Header_Length', 'Tot size', 'syn_count', 'IAT', 
                            'ack_flag_number', 'HTTPS', 'Number', 'Duration', 'rst_count', 'syn_flag_number', 
                            'psh_flag_number', 'TCP', 'urg_count', 'Protocol Type', 'UDP', 'HTTP', 'ack_count', 
                            'fin_count', 'Rate', 'Srate', 'rst_flag_number', 'DNS']
        
        missing_columns = [col for col in required_columns if col not in df.columns]

        if not missing_columns:
            df_features = df[scaler.get_feature_names_out()]
            X_test_scaled = scaler.transform(df_features)

            # Predict and get probabilities
            predictions = model.predict(X_test_scaled)
            prediction_proba = model.predict_proba(X_test_scaled)

           # Calculate average probabilities as percentages for both classes
            avg_prob_malicious = round(prediction_proba[:, 0].mean() * 100, 2)  # Class 0 probabilities
            avg_prob_normal = round(prediction_proba[:, 1].mean() * 100, 2)  # Class 1 probabilities

            # Store in session
            session['avg_prob_malicious'] = avg_prob_malicious
            session['avg_prob_normal'] = avg_prob_normal

            # Convert predictions to DataFrame and merge with original DataFrame
            df['Prediction'] = predictions
            df['Prediction Probability (Max = 1)'] = [prediction_proba[i, prediction] for i, prediction in enumerate(predictions)]

            # Store the DataFrame in session
            session['prediction_df'] = df.to_json(orient='split')

            prediction_dict = df.to_dict()
            return jsonify({'prediction': prediction_dict})
        else:
            missing_columns_str = ', '.join(missing_columns)
            return redirect(url_for('index', message=f'Missing columns: {missing_columns_str}'))
    else:
        return jsonify(error="Invalid file type"), 400

@tryThis.route('/chart-data', methods=['GET'])
def chart_data():
    avg_prob_malicious = session.get('avg_prob_malicious', 0)
    avg_prob_normal = session.get('avg_prob_normal', 0)
    return jsonify({
        'avg_prob_malicious': avg_prob_malicious,
        'avg_prob_normal': avg_prob_normal
    })

@tryThis.route('/pred')
def pred():
    prediction_df_json = session.get('prediction_df', None)
    if prediction_df_json:
        prediction_df = pd.read_json(prediction_df_json, orient='split')
        return render_template('prediction.html', tables=[prediction_df.to_html(classes='data', header="true")])
    else:
        return redirect(url_for('index', message='No predictions to display'))

if __name__ == '__main__':
    tryThis.run(debug=True, port=5001)