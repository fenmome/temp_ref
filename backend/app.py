from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta
import pytz

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="your_username",
        password="your_password",
        database="your_database"
    )

@app.route('/temperature')
def get_temperature():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get data for the last 12 hours
        end_time = datetime.now(pytz.UTC)
        start_time = end_time - timedelta(hours=12)
        
        query = """
            SELECT timestamp, temperature 
            FROM temperature_readings 
            WHERE timestamp BETWEEN %s AND %s 
            ORDER BY timestamp DESC
        """
        
        cursor.execute(query, (start_time, end_time))
        results = cursor.fetchall()
        
        # Convert datetime objects to ISO format strings
        for row in results:
            row['timestamp'] = row['timestamp'].isoformat()
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)