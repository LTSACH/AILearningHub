import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import plotly.graph_objects as go
import plotly.express as px
import os
import urllib.request

def download_mushroom_dataset():
    """Download UCI Mushroom dataset if not available locally."""
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/mushroom/agaricus-lepiota.data"
    filename = "mushroom_dataset.csv"
    
    if not os.path.exists(filename):
        print(f"Downloading UCI Mushroom dataset from {url}...")
        try:
            urllib.request.urlretrieve(url, filename)
            print(f"✅ Dataset downloaded to {filename}")
        except Exception as e:
            print(f"❌ Failed to download dataset: {e}")
            return None
    else:
        print(f"✅ Dataset already exists at {filename}")
    
    return filename

def load_mushroom_data():
    """Load and prepare Mushroom dataset."""
    print("🍄 Loading UCI Mushroom dataset...")
    
    # Download dataset if needed
    filename = download_mushroom_dataset()
    if not filename:
        print("Creating sample mushroom data...")
        return create_sample_mushroom_data()
    
    try:
        # Load the dataset
        df = pd.read_csv(filename, header=None)
        
        # Define column names based on UCI dataset description
        column_names = [
            'class', 'cap-shape', 'cap-surface', 'cap-color', 'bruises', 'odor',
            'gill-attachment', 'gill-spacing', 'gill-size', 'gill-color',
            'stalk-shape', 'stalk-root', 'stalk-surface-above-ring',
            'stalk-surface-below-ring', 'stalk-color-above-ring',
            'stalk-color-below-ring', 'veil-type', 'veil-color', 'ring-number',
            'ring-type', 'spore-print-color', 'habitat', 'population'
        ]
        
        df.columns = column_names
        
        print(f"Dataset shape: {df.shape}")
        print(f"Features: {df.shape[1] - 1}")
        print(f"Samples: {df.shape[0]}")
        
        # Check for missing values
        missing_values = df.isnull().sum().sum()
        if missing_values > 0:
            print(f"⚠️ Found {missing_values} missing values")
            # Fill missing values with mode for categorical data
            for col in df.columns:
                if df[col].dtype == 'object':
                    df[col] = df[col].fillna(df[col].mode()[0])
        
        # Display class distribution
        class_counts = df['class'].value_counts()
        print(f"\nClass distribution:")
        for class_name, count in class_counts.items():
            print(f"  {class_name}: {count} ({count/len(df)*100:.1f}%)")
        
        return df
        
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        print("Creating sample mushroom data...")
        return create_sample_mushroom_data()

def create_sample_mushroom_data():
    """Create sample mushroom data for demonstration."""
    print("Creating sample mushroom data...")
    
    np.random.seed(42)
    n_samples = 100
    
    # Sample mushroom characteristics
    cap_shapes = ['convex', 'flat', 'knobbed', 'bell', 'conical', 'sunken']
    cap_surfaces = ['smooth', 'scaly', 'fibrous', 'grooves']
    cap_colors = ['brown', 'yellow', 'white', 'gray', 'red', 'pink', 'buff', 'purple', 'cinnamon', 'green']
    bruises = ['bruises', 'no']
    odors = ['none', 'foul', 'fishy', 'spicy', 'almond', 'anise', 'pungent', 'creosote', 'musty']
    
    # Generate sample data
    data = {
        'class': np.random.choice(['e', 'p'], n_samples, p=[0.6, 0.4]),  # 60% edible, 40% poisonous
        'cap-shape': np.random.choice(cap_shapes, n_samples),
        'cap-surface': np.random.choice(cap_surfaces, n_samples),
        'cap-color': np.random.choice(cap_colors, n_samples),
        'bruises': np.random.choice(bruises, n_samples),
        'odor': np.random.choice(odors, n_samples)
    }
    
    # Add some logic to make it more realistic
    for i in range(n_samples):
        # If it's poisonous, increase chance of foul odor
        if data['class'][i] == 'p' and np.random.random() < 0.3:
            data['odor'][i] = 'foul'
        # If it's edible, increase chance of no odor
        elif data['class'][i] == 'e' and np.random.random() < 0.4:
            data['odor'][i] = 'none'
    
    df = pd.DataFrame(data)
    print(f"Sample dataset created with {len(df)} samples")
    return df

def encode_categorical_data(df, target_column='class'):
    """Encode categorical features using LabelEncoder."""
    print("Encoding categorical features...")
    
    # Separate features and target
    X = df.drop(target_column, axis=1)
    y = df[target_column]
    
    # Create encoders for each feature
    encoders = {}
    X_encoded = X.copy()
    
    for column in X.columns:
        encoder = LabelEncoder()
        X_encoded[column] = encoder.fit_transform(X[column].astype(str))
        encoders[column] = encoder
        print(f"  {column}: {len(encoder.classes_)} unique values")
    
    # Encode target
    target_encoder = LabelEncoder()
    y_encoded = target_encoder.fit_transform(y)
    
    print(f"Encoded features shape: {X_encoded.shape}")
    print(f"Target classes: {target_encoder.classes_}")
    
    return X_encoded, y_encoded, encoders, target_encoder

def split_data(X, y, test_size=0.2, val_size=0.2, random_state=42):
    """Split data into train, validation, and test sets."""
    print("Splitting data into train/validation/test sets...")
    
    # First split: train+val vs test
    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    # Second split: train vs val
    val_size_adjusted = val_size / (1 - test_size)  # Adjust for the remaining data
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=val_size_adjusted, random_state=random_state, stratify=y_temp
    )
    
    print(f"Train set: {X_train.shape[0]} samples")
    print(f"Validation set: {X_val.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    return X_train, X_val, X_test, y_train, y_val, y_test

def train_model(X_train, y_train):
    """Train Softmax Regression model (LogisticRegression with multinomial)."""
    print("Training Softmax Regression model...")
    
    # Use LogisticRegression with multinomial for softmax regression
    model = LogisticRegression(
        multi_class='multinomial',
        solver='lbfgs',  # Good for small datasets
        max_iter=1000,
        random_state=42,
        C=1.0  # Regularization parameter
    )
    
    model.fit(X_train, y_train)
    print("✅ Model training completed")
    
    return model

def evaluate_model(model, X_test, y_test, target_names, output_dir="output"):
    """Evaluate model and generate reports/plots."""
    print("Evaluating model performance...")
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {accuracy:.4f}")
    
    # Classification Report
    report = classification_report(y_test, y_pred, target_names=target_names)
    print("\nClassification Report:")
    print(report)
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(cm)
    
    # Create output directory
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Plot Confusion Matrix with Plotly
    fig_cm = px.imshow(
        cm,
        labels=dict(x="Predicted", y="True", color="Count"),
        x=target_names,
        y=target_names,
        color_continuous_scale="Plasma",
        title="Confusion Matrix - Mushroom Safety Classification"
    )
    
    # Update layout
    fig_cm.update_layout(
        width=600,
        height=500,
        font=dict(size=12)
    )
    
    # Save confusion matrix (skip if kaleido not available)
    try:
        cm_path = os.path.join(output_dir, "mushroom_confusion_matrix.png")
        fig_cm.write_image(cm_path)
        print(f"Confusion matrix saved to {cm_path}")
    except Exception as e:
        print(f"⚠️ Could not save confusion matrix image: {e}")
        print("Continuing without image export...")
    
    # Generate HTML report
    html_report = generate_html_report(accuracy, report, cm, target_names)
    report_path = os.path.join(output_dir, "mushroom_classification_report.html")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(html_report)
    print(f"HTML report saved to {report_path}")
    
    return accuracy, report, cm

def generate_html_report(accuracy, report, cm, target_names):
    """Generate HTML report for classification results."""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Mushroom Safety Classification Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .header {{ background: #28a745; color: white; padding: 20px; border-radius: 8px; }}
            .section {{ margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }}
            .accuracy {{ font-size: 24px; font-weight: bold; color: #28a745; }}
            pre {{ background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }}
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: center; }}
            th {{ background: #f8f9fa; }}
            .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🍄 Mushroom Safety Classification Report</h1>
            <p>Softmax Regression Model Performance Analysis</p>
        </div>
        
        <div class="warning">
            <strong>⚠️ IMPORTANT DISCLAIMER:</strong> This model is for educational purposes only. 
            Never rely on this model for real mushroom identification. Always consult with expert mycologists 
            or use proper field guides when foraging for mushrooms.
        </div>
        
        <div class="section">
            <h2>Overall Performance</h2>
            <div class="accuracy">Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)</div>
        </div>
        
        <div class="section">
            <h2>Classification Report</h2>
            <pre>{report}</pre>
        </div>
        
        <div class="section">
            <h2>Confusion Matrix</h2>
            <table>
                <tr>
                    <th></th>
                    {''.join([f'<th>{name}</th>' for name in target_names])}
                </tr>
                {''.join([f'<tr><th>{target_names[i]}</th>' + ''.join([f'<td>{cm[i][j]}</td>' for j in range(len(target_names))]) + '</tr>' for i in range(len(target_names))])}
            </table>
        </div>
        
        <div class="section">
            <h2>Model Information</h2>
            <ul>
                <li><strong>Algorithm:</strong> Softmax Regression (LogisticRegression with multinomial)</li>
                <li><strong>Features:</strong> Categorical mushroom characteristics</li>
                <li><strong>Encoding:</strong> LabelEncoder for categorical variables</li>
                <li><strong>Regularization:</strong> L2 (C=1.0)</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>Safety Guidelines</h2>
            <ul>
                <li>🍄 Always consult multiple reliable sources for mushroom identification</li>
                <li>🔍 Use proper field guides and expert knowledge</li>
                <li>⚠️ When in doubt, don't eat the mushroom</li>
                <li>📚 Learn from experienced foragers and mycologists</li>
                <li>🧪 Consider spore prints and other detailed characteristics</li>
            </ul>
        </div>
    </body>
    </html>
    """
    return html_content

def get_feature_importance(model, encoders, top_n=10):
    """Get feature importance for each class."""
    print(f"Extracting feature importance...")
    
    feature_names = list(encoders.keys())
    classes = model.classes_
    
    
    feature_importance = {}
    
    # Check if this is binary or multiclass classification
    if model.coef_.shape[0] == 1:
        # Binary classification - only one coefficient vector
        coef = model.coef_[0]
        
        # Get top features (most negative coefficients for multinomial)
        top_indices = coef.argsort()[:top_n]
        top_features = [(feature_names[idx], coef[idx]) for idx in top_indices]
        
        # For binary classification, show features for both classes
        feature_importance[classes[0]] = top_features
        feature_importance[classes[1]] = top_features  # Same features, different interpretation
        
        print(f"\nTop {top_n} features (applies to both classes):")
        for feature, score in top_features:
            print(f"  {feature}: {score:.4f}")
    else:
        # Multiclass - get coefficients for each class
        for i, class_name in enumerate(classes):
            coef = model.coef_[i]
            
            # Get top features (most negative coefficients for multinomial)
            top_indices = coef.argsort()[:top_n]
            top_features = [(feature_names[idx], coef[idx]) for idx in top_indices]
            
            feature_importance[class_name] = top_features
            print(f"\nTop {top_n} features for class '{class_name}':")
            for feature, score in top_features:
                print(f"  {feature}: {score:.4f}")
    
    return feature_importance

def predict_mushroom_safety(model, encoders, target_encoder, mushroom_features):
    """Predict safety for mushroom with given features."""
    print(f"\nPredicting safety for mushroom with features: {mushroom_features}")
    
    # Encode the features - need to encode ALL features that the model expects
    encoded_features = []
    for feature_name in encoders.keys():
        if feature_name in mushroom_features:
            value = mushroom_features[feature_name]
            try:
                encoded_value = encoders[feature_name].transform([value])[0]
                encoded_features.append(encoded_value)
            except ValueError:
                print(f"⚠️ Unknown value '{value}' for feature '{feature_name}'")
                # Use the most common value as fallback
                most_common = encoders[feature_name].classes_[0]
                encoded_value = encoders[feature_name].transform([most_common])[0]
                encoded_features.append(encoded_value)
                print(f"  Using fallback value: {most_common}")
        else:
            print(f"⚠️ Missing feature '{feature_name}', using most common value")
            # Use the most common value for missing features
            most_common = encoders[feature_name].classes_[0]
            encoded_value = encoders[feature_name].transform([most_common])[0]
            encoded_features.append(encoded_value)
            print(f"  Using fallback value: {most_common}")
    
    # Make prediction
    X_new = np.array(encoded_features).reshape(1, -1)
    prediction = model.predict(X_new)[0]
    probabilities = model.predict_proba(X_new)[0]
    
    # Get class names
    class_names = target_encoder.classes_
    predicted_class = class_names[prediction]
    
    print(f"Predicted safety: {predicted_class}")
    print("Probability distribution:")
    for i, prob in enumerate(probabilities):
        print(f"  {class_names[i]}: {prob:.4f}")
    
    return predicted_class, probabilities

def create_safety_checker_demo():
    """Create a demo of the safety checker."""
    print("\n" + "="*60)
    print("🍄 MUSHROOM SAFETY CHECKER DEMO")
    print("="*60)
    
    # Example mushroom characteristics
    example_mushrooms = [
        {
            'cap-shape': 'convex',
            'cap-surface': 'smooth', 
            'cap-color': 'brown',
            'bruises': 'no',
            'odor': 'none'
        },
        {
            'cap-shape': 'flat',
            'cap-surface': 'scaly',
            'cap-color': 'red',
            'bruises': 'bruises',
            'odor': 'foul'
        },
        {
            'cap-shape': 'bell',
            'cap-surface': 'smooth',
            'cap-color': 'white',
            'bruises': 'no',
            'odor': 'almond'
        }
    ]
    
    return example_mushrooms

def main():
    """Main function to run the complete pipeline."""
    print("🚀 Starting Mushroom Safety Classification with Softmax Regression")
    print("=" * 70)
    
    # Load data
    df = load_mushroom_data()
    
    # Encode categorical data
    X, y, encoders, target_encoder = encode_categorical_data(df)
    
    # Split data
    X_train, X_val, X_test, y_train, y_val, y_test = split_data(X, y)
    
    # Get target names
    target_names = target_encoder.classes_
    
    # Train model
    model = train_model(X_train, y_train)
    
    # Evaluate on validation set
    print("\n" + "="*50)
    print("VALIDATION SET EVALUATION")
    print("="*50)
    val_accuracy, val_report, val_cm = evaluate_model(
        model, X_val, y_val, target_names, "output/validation"
    )
    
    # Evaluate on test set
    print("\n" + "="*50)
    print("TEST SET EVALUATION")
    print("="*50)
    test_accuracy, test_report, test_cm = evaluate_model(
        model, X_test, y_test, target_names, "output/test"
    )
    
    # Feature importance
    print("\n" + "="*50)
    print("FEATURE IMPORTANCE ANALYSIS")
    print("="*50)
    feature_importance = get_feature_importance(model, encoders, top_n=10)
    
    # Safety checker demo
    print("\n" + "="*50)
    print("SAFETY CHECKER DEMO")
    print("="*50)
    example_mushrooms = create_safety_checker_demo()
    
    for i, mushroom in enumerate(example_mushrooms, 1):
        print(f"\n--- Example Mushroom {i} ---")
        predict_mushroom_safety(model, encoders, target_encoder, mushroom)
    
    print("\n" + "="*70)
    print("✅ Mushroom Safety Classification Pipeline Completed Successfully!")
    print(f"Final Test Accuracy: {test_accuracy:.4f}")
    print("⚠️ Remember: This is for educational purposes only!")
    print("="*70)

if __name__ == "__main__":
    main()
