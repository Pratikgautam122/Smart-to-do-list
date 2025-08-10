from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'supersecret'

users = {}  # username: password
tasks = {}  # username: [ {text, date, category, reminder, done} ]

# ✅ Updated decorator to handle "Bearer <token>"
def token_required(f):
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Missing token'}), 401

        # Handle "Bearer <token>" format
        if token.startswith("Bearer "):
            token = token.split(" ")[1]

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            username = data['username']
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401

        return f(username, *args, **kwargs)
    decorator.__name__ = f.__name__
    return decorator

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Missing fields'}), 400
    if username in users:
        return jsonify({'error': 'Username exists'}), 400
    users[username] = password
    tasks[username] = []
    return jsonify({'message': 'Signup successful'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if users.get(username) != password:
        return jsonify({'error': 'Invalid credentials'}), 401
    token = jwt.encode({
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token})

@app.route('/tasks', methods=['GET'])
@token_required
def get_tasks(username):
    return jsonify(tasks.get(username, []))

@app.route('/tasks', methods=['POST'])
@token_required
def add_task(username):
    data = request.json
    task = {
        "text": data.get("text", ""),
        "date": data.get("date", ""),
        "category": data.get("category", ""),
        "reminder": data.get("reminder", False),
        "done": False
    }
    tasks[username].append(task)
    return jsonify({"message": "Task added"})

@app.route('/tasks/<int:idx>', methods=['PUT'])
@token_required
def edit_task(username, idx):
    data = request.json
    if 0 <= idx < len(tasks[username]):
        tasks[username][idx].update(data)
        return jsonify({"message": "Task updated"})
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<int:idx>', methods=['DELETE'])
@token_required
def delete_task(username, idx):
    if 0 <= idx < len(tasks[username]):
        tasks[username].pop(idx)
        return jsonify({"message": "Task deleted"})
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<int:idx>/toggle', methods=['POST'])
@token_required
def toggle_task(username, idx):
    if 0 <= idx < len(tasks[username]):
        tasks[username][idx]['done'] = not tasks[username][idx].get('done', False)
        return jsonify({"message": "Task toggled"})
    return jsonify({"error": "Task not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)