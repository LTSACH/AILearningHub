"""
Mushroom Classification using Categorical Naive Bayes
====================================================

This script demonstrates categorical classification using Categorical Naive Bayes
on the Mushroom dataset for food safety classification.

Features:
- Downloads UCI Mushroom dataset if not available locally
- Proper categorical encoding for all features
- Train/Validation/Test split
- Comprehensive evaluation and visualization
- Interactive safety checker demo
"""

import pandas as pd
import numpy as np
import os
import urllib.request
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.naive_bayes import CategoricalNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

def download_mushroom_dataset():
    """Download UCI Mushroom dataset if not available locally"""
    dataset_url = "https://archive.ics.uci.edu/ml/machine-learning-databases/mushroom/agaricus-lepiota.data"
    local_path = "mushroom_dataset.csv"
    
    if os.path.exists(local_path):
        print(f"Dataset already exists at {local_path}")
        return local_path
    
    print("Downloading UCI Mushroom dataset...")
    try:
        urllib.request.urlretrieve(dataset_url, local_path)
        print(f"Dataset downloaded successfully to {local_path}")
        return local_path
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        print("Creating synthetic dataset as fallback...")
        return None

def load_mushroom_data():
    """Load and prepare Mushroom dataset"""
    print("=" * 60)
    print("LOADING MUSHROOM DATASET")
    print("=" * 60)
    
    # Try to download real dataset
    dataset_path = download_mushroom_dataset()
    
    if dataset_path and os.path.exists(dataset_path):
        # Load real UCI dataset
        print("Loading real UCI Mushroom dataset...")
        df = pd.read_csv(dataset_path, header=None)
        
        # Define feature names (from UCI documentation)
        # Note: In UCI dataset, class is the FIRST column, not the last
        feature_names = [
            'cap-shape', 'cap-surface', 'cap-color', 'bruises', 'odor',
            'gill-attachment', 'gill-spacing', 'gill-size', 'gill-color',
            'stalk-shape', 'stalk-root', 'stalk-surface-above-ring',
            'stalk-surface-below-ring', 'stalk-color-above-ring',
            'stalk-color-below-ring', 'veil-type', 'veil-color',
            'ring-number', 'ring-type', 'spore-print-color',
            'population', 'habitat'
        ]
        
        # Add column names (class is first column in UCI dataset)
        df.columns = ['class'] + feature_names
        
        # Handle missing values first
        print(f"Before cleaning: {df.shape[0]} samples")
        
        # Check for missing values in class column
        missing_class = df['class'].isnull().sum()
        if missing_class > 0:
            print(f"Missing class labels: {missing_class}")
            # Drop rows with missing class labels
            df = df.dropna(subset=['class'])
            print(f"After dropping missing class labels: {df.shape[0]} samples")
        
        # Map class labels to readable names
        print(f"Class values before mapping: {df['class'].unique()}")
        df['class'] = df['class'].map({'e': 'edible', 'p': 'poisonous'})
        print(f"Class values after mapping: {df['class'].unique()}")
        
        # Check for any remaining missing values in features
        missing_in_features = df[feature_names].isnull().sum().sum()
        if missing_in_features > 0:
            print(f"Missing values in features: {missing_in_features}")
            # Fill missing values with most frequent value for each feature
            for feature in feature_names:
                if df[feature].isnull().any():
                    most_frequent = df[feature].mode()[0]
                    df[feature] = df[feature].fillna(most_frequent)
                    print(f"  Filled missing values in {feature} with '{most_frequent}'")
        
        print(f"Final dataset shape: {df.shape}")
        print(f"Final class distribution: {df['class'].value_counts().to_dict()}")
        
    else:
        # Create synthetic dataset as fallback
        print("Creating synthetic Mushroom dataset...")
        df, feature_names = create_synthetic_mushroom_data()
    
    print(f"Dataset shape: {df.shape}")
    print(f"Features: {len(feature_names)} categorical features")
    print(f"Classes: {df['class'].value_counts().to_dict()}")
    
    # Display basic statistics
    print(f"\nClass distribution:")
    class_counts = df['class'].value_counts()
    for class_name, count in class_counts.items():
        percentage = (count / len(df)) * 100
        print(f"  {class_name}: {count} samples ({percentage:.1f}%)")
    
    # Show sample of data
    print(f"\nFirst 5 rows:")
    print(df.head())
    
    # Check for missing values
    missing_values = df.isnull().sum()
    if missing_values.any():
        print(f"\nMissing values found:")
        print(missing_values[missing_values > 0])
    else:
        print(f"\nNo missing values found.")
    
    return df, feature_names

def create_synthetic_mushroom_data():
    """Create synthetic mushroom data for demonstration"""
    print("Creating synthetic mushroom dataset...")
    
    # Feature names
    feature_names = [
        'cap-shape', 'cap-surface', 'cap-color', 'bruises', 'odor',
        'gill-attachment', 'gill-spacing', 'gill-size', 'gill-color',
        'stalk-shape', 'stalk-root', 'stalk-surface-above-ring',
        'stalk-surface-below-ring', 'stalk-color-above-ring',
        'stalk-color-below-ring', 'veil-type', 'veil-color',
        'ring-number', 'ring-type', 'spore-print-color',
        'population', 'habitat'
    ]
    
    # Possible values for each feature (simplified)
    feature_values = {
        'cap-shape': ['bell', 'conical', 'convex', 'flat', 'knobbed', 'sunken'],
        'cap-surface': ['fibrous', 'grooves', 'scaly', 'smooth'],
        'cap-color': ['brown', 'buff', 'cinnamon', 'gray', 'green', 'pink', 'purple', 'red', 'white', 'yellow'],
        'bruises': ['bruises', 'no'],
        'odor': ['almond', 'anise', 'creosote', 'fishy', 'foul', 'musty', 'none', 'pungent', 'spicy'],
        'gill-attachment': ['attached', 'descending', 'free', 'notched'],
        'gill-spacing': ['close', 'crowded', 'distant'],
        'gill-size': ['broad', 'narrow'],
        'gill-color': ['black', 'brown', 'buff', 'chocolate', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
        'stalk-shape': ['enlarging', 'tapering'],
        'stalk-root': ['bulbous', 'club', 'cup', 'equal', 'rhizomorphs', 'rooted', 'missing'],
        'stalk-surface-above-ring': ['fibrous', 'scaly', 'silky', 'smooth'],
        'stalk-surface-below-ring': ['fibrous', 'scaly', 'silky', 'smooth'],
        'stalk-color-above-ring': ['brown', 'buff', 'cinnamon', 'gray', 'orange', 'pink', 'red', 'white', 'yellow'],
        'stalk-color-below-ring': ['brown', 'buff', 'cinnamon', 'gray', 'orange', 'pink', 'red', 'white', 'yellow'],
        'veil-type': ['partial', 'universal'],
        'veil-color': ['brown', 'orange', 'white', 'yellow'],
        'ring-number': ['none', 'one', 'two'],
        'ring-type': ['cobwebby', 'evanescent', 'flaring', 'large', 'none', 'pendant', 'sheathing', 'zone'],
        'spore-print-color': ['black', 'brown', 'buff', 'chocolate', 'green', 'orange', 'purple', 'white', 'yellow'],
        'population': ['abundant', 'clustered', 'numerous', 'scattered', 'several', 'solitary'],
        'habitat': ['grasses', 'leaves', 'meadows', 'paths', 'urban', 'waste', 'woods']
    }
    
    # Generate synthetic data
    np.random.seed(42)
    n_samples = 2000
    
    data = []
    for i in range(n_samples):
        # Generate random features
        sample = []
        for feature in feature_names:
            values = feature_values[feature]
            sample.append(np.random.choice(values))
        
        # Determine class based on some rules (simplified)
        # This is just for demonstration - real mushrooms are much more complex
        odor = sample[4]  # odor is at index 4
        bruises = sample[3]  # bruises is at index 3
        
        if odor in ['foul', 'pungent', 'creosote'] or bruises == 'bruises':
            sample.append('poisonous')
        else:
            sample.append('edible')
        
        data.append(sample)
    
    # Create DataFrame
    df = pd.DataFrame(data, columns=feature_names + ['class'])
    
    return df, feature_names

def encode_categorical_features(df, feature_names):
    """Encode categorical features to numerical values"""
    print("=" * 60)
    print("ENCODING CATEGORICAL FEATURES")
    print("=" * 60)
    
    # Separate features and target
    X = df[feature_names].copy()
    y = df['class'].copy()
    
    print(f"Original data shape: {X.shape}")
    print(f"Target variable: {y.value_counts().to_dict()}")
    
    # Encode each categorical feature
    encoders = {}
    X_encoded = X.copy()
    
    print(f"\nEncoding {len(feature_names)} categorical features:")
    for i, feature in enumerate(feature_names, 1):
        le = LabelEncoder()
        X_encoded[feature] = le.fit_transform(X[feature])
        encoders[feature] = le
        
        unique_values = X[feature].unique()
        print(f"  {i:2d}. {feature:25s}: {len(unique_values):2d} unique values - {list(unique_values[:5])}{'...' if len(unique_values) > 5 else ''}")
    
    # Encode target variable
    le_target = LabelEncoder()
    y_encoded = le_target.fit_transform(y)
    
    print(f"\nTarget encoding:")
    print(f"  Original classes: {list(y.unique())}")
    print(f"  Encoded classes: {le_target.classes_}")
    print(f"  Class mapping: {dict(zip(le_target.classes_, range(len(le_target.classes_))))}")
    
    print(f"\nEncoded data shape: {X_encoded.shape}")
    print(f"Data types: {X_encoded.dtypes.value_counts().to_dict()}")
    
    return X_encoded, y_encoded, encoders, le_target

def split_data(X, y, test_size=0.2, val_size=0.2, random_state=42):
    """Split data into train, validation, and test sets"""
    print("=" * 60)
    print("SPLITTING DATA")
    print("=" * 60)
    
    # First split: separate test set
    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    # Second split: separate train and validation from remaining data
    val_size_adjusted = val_size / (1 - test_size)  # Adjust val_size for remaining data
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=val_size_adjusted, random_state=random_state, stratify=y_temp
    )
    
    print(f"Data split:")
    print(f"  Training set:   {X_train.shape[0]:4d} samples ({X_train.shape[0]/len(X)*100:.1f}%)")
    print(f"  Validation set: {X_val.shape[0]:4d} samples ({X_val.shape[0]/len(X)*100:.1f}%)")
    print(f"  Test set:       {X_test.shape[0]:4d} samples ({X_test.shape[0]/len(X)*100:.1f}%)")
    print(f"  Total:          {len(X):4d} samples")
    
    # Check class distribution in each set
    print(f"\nClass distribution:")
    for set_name, y_set in [("Training", y_train), ("Validation", y_val), ("Test", y_test)]:
        unique, counts = np.unique(y_set, return_counts=True)
        print(f"  {set_name:10s}: {dict(zip(unique, counts))}")
    
    return X_train, X_val, X_test, y_train, y_val, y_test

def train_model(X_train, y_train):
    """Train Categorical Naive Bayes model"""
    print("Training Categorical Naive Bayes model...")
    
    # Initialize Categorical NB
    model = CategoricalNB(alpha=1.0)  # Laplace smoothing
    
    # Train the model
    model.fit(X_train, y_train)
    
    print("Model training completed!")
    return model

def evaluate_model(model, X_test, y_test, le_target):
    """Evaluate model performance"""
    print("Evaluating model performance...")
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.4f}")
    
    # Classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le_target.classes_))
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(cm)
    
    return y_pred, accuracy

def get_feature_importance(model, feature_names, encoders, top_n=10):
    """Get top features for each class"""
    print(f"Extracting top {top_n} features per class...")
    
    classes = model.classes_
    feature_importance = {}
    
    for i, class_name in enumerate(classes):
        # Get log probabilities for this class
        log_probs = model.feature_log_prob_[i]
        
        # Get top features by sorting log probabilities
        feature_scores = []
        for j, feature_name in enumerate(feature_names):
            if j < len(log_probs):  # Check bounds
                # Handle numpy array properly
                try:
                    if hasattr(log_probs[j], 'item') and log_probs[j].size == 1:
                        score = log_probs[j].item()  # Convert numpy scalar to Python scalar
                    else:
                        score = float(log_probs[j])
                except (ValueError, TypeError):
                    # Fallback: use mean if it's an array
                    score = float(np.mean(log_probs[j]))
                feature_scores.append((feature_name, score))
        
        # Sort by score (descending)
        feature_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Get top N features
        top_features = feature_scores[:top_n]
        
        feature_importance[class_name] = top_features
        print(f"\nTop {top_n} features for '{class_name}':")
        for feature_name, score in top_features:
            print(f"  {feature_name}: {score:.4f}")
    
    return feature_importance

def predict_mushroom_safety(model, encoders, le_target, mushroom_features):
    """Predict safety for a specific mushroom"""
    print(f"Predicting safety for mushroom with features: {mushroom_features}")
    
    # Get all feature names from the model
    all_feature_names = list(encoders.keys())
    
    # Encode the input features (fill missing features with default values)
    encoded_features = []
    for feature_name in all_feature_names:
        if feature_name in mushroom_features:
            try:
                encoded_value = encoders[feature_name].transform([mushroom_features[feature_name]])[0]
                encoded_features.append(encoded_value)
            except ValueError:
                print(f"Warning: Unknown value '{mushroom_features[feature_name]}' for feature '{feature_name}'")
                # Use most common value as default
                encoded_features.append(0)
        else:
            # Use most common value as default for missing features
            encoded_features.append(0)
    
    # Make prediction
    prediction = model.predict([encoded_features])[0]
    probabilities = model.predict_proba([encoded_features])[0]
    
    predicted_class = le_target.inverse_transform([prediction])[0]
    
    print(f"Predicted class: {predicted_class}")
    print("Class probabilities:")
    for i, class_name in enumerate(le_target.classes_):
        print(f"  {class_name}: {probabilities[i]:.4f}")
    
    return predicted_class, probabilities

def safety_checker_demo(model, encoders, le_target):
    """Demonstrate safety checker with example mushrooms"""
    print("\n" + "=" * 50)
    print("Mushroom Safety Checker Demo")
    print("=" * 50)
    
    # Example mushrooms (using only 5 key features for demo)
    example_mushrooms = [
        {
            'name': 'Safe Mushroom',
            'features': {
                'cap-shape': 'x',  # Use UCI values
                'cap-surface': 's',
                'cap-color': 'n',
                'bruises': 'f',
                'odor': 'n'
            }
        },
        {
            'name': 'Dangerous Mushroom',
            'features': {
                'cap-shape': 'x',
                'cap-surface': 's',
                'cap-color': 'r',
                'bruises': 'f',
                'odor': 'p'
            }
        },
        {
            'name': 'Questionable Mushroom',
            'features': {
                'cap-shape': 'f',
                'cap-surface': 'y',
                'cap-color': 'y',
                'bruises': 't',
                'odor': 'a'
            }
        }
    ]
    
    for mushroom in example_mushrooms:
        print(f"\n--- {mushroom['name']} ---")
        predicted_class, probabilities = predict_mushroom_safety(
            model, encoders, le_target, mushroom['features']
        )
        
        safety_status = "✅ SAFE" if predicted_class == 'edible' else "⚠️ POISONOUS"
        confidence = max(probabilities)
        
        print(f"Safety Status: {safety_status}")
        print(f"Confidence: {confidence:.2%}")
        print("-" * 30)

def main():
    """Main execution function"""
    print("=" * 80)
    print("🍄 MUSHROOM CLASSIFICATION WITH CATEGORICAL NAIVE BAYES")
    print("=" * 80)
    
    # 1. Load data
    df, feature_names = load_mushroom_data()
    
    # 2. Encode categorical features
    X_encoded, y_encoded, encoders, le_target = encode_categorical_features(df, feature_names)
    
    # 3. Split data into train/val/test
    X_train, X_val, X_test, y_train, y_val, y_test = split_data(X_encoded, y_encoded)
    
    # 4. Train model
    print("=" * 60)
    print("TRAINING MODEL")
    print("=" * 60)
    model = train_model(X_train, y_train)
    
    # 5. Evaluate model on validation set
    print("=" * 60)
    print("VALIDATION EVALUATION")
    print("=" * 60)
    y_val_pred, val_accuracy = evaluate_model(model, X_val, y_val, le_target)
    
    # 6. Evaluate model on test set
    print("=" * 60)
    print("TEST EVALUATION")
    print("=" * 60)
    y_test_pred, test_accuracy = evaluate_model(model, X_test, y_test, le_target)
    
    # 7. Feature importance analysis
    print("=" * 60)
    print("FEATURE IMPORTANCE ANALYSIS")
    print("=" * 60)
    feature_importance = get_feature_importance(model, feature_names, encoders, top_n=10)
    
    # 8. Safety checker demo
    safety_checker_demo(model, encoders, le_target)
    
    # 9. Summary
    print("\n" + "=" * 80)
    print("📊 FINAL RESULTS SUMMARY")
    print("=" * 80)
    print(f"Validation Accuracy: {val_accuracy:.4f} ({val_accuracy*100:.2f}%)")
    print(f"Test Accuracy:       {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
    print(f"Model Type:          Categorical Naive Bayes")
    print(f"Features:            {len(feature_names)} categorical features")
    print(f"Training Samples:    {X_train.shape[0]}")
    print(f"Validation Samples:  {X_val.shape[0]}")
    print(f"Test Samples:        {X_test.shape[0]}")
    
    print("\n" + "=" * 80)
    print("⚠️  IMPORTANT SAFETY NOTICE")
    print("=" * 80)
    print("This is a DEMONSTRATION for educational purposes only.")
    print("NEVER use this model for real mushroom identification!")
    print("Always consult with mycologists and field guides.")
    print("Mistakes in mushroom identification can be FATAL!")
    print("=" * 80)
    
    print("\n" + "=" * 80)
    print("✅ Analysis completed successfully!")
    print("=" * 80)
    
    return model, encoders, le_target, X_test, y_test, y_test_pred

if __name__ == "__main__":
    main()
