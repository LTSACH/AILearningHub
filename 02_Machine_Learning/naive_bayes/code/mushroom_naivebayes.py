"""
Mushroom Classification using Categorical Naive Bayes
====================================================

This script demonstrates categorical classification using Categorical Naive Bayes
on the Mushroom dataset for food safety classification.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.naive_bayes import CategoricalNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

def load_mushroom_data():
    """Load and prepare Mushroom dataset"""
    print("Loading Mushroom dataset...")
    
    # Simulate Mushroom data structure
    # In practice, you would load from UCI ML Repository
    categories = ['edible', 'poisonous']
    
    # Sample data (in real scenario, load from UCI files)
    sample_data = [
        # Edible mushrooms
        ['convex', 'smooth', 'brown', 'no', 'none', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'edible'],
        ['convex', 'smooth', 'yellow', 'no', 'none', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'edible'],
        ['flat', 'smooth', 'white', 'no', 'none', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'edible'],
        ['convex', 'scaly', 'brown', 'no', 'none', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'edible'],
        ['convex', 'smooth', 'gray', 'no', 'none', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'edible'],
        
        # Poisonous mushrooms
        ['convex', 'smooth', 'brown', 'no', 'foul', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'poisonous'],
        ['convex', 'smooth', 'yellow', 'no', 'foul', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'poisonous'],
        ['convex', 'scaly', 'brown', 'no', 'foul', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'poisonous'],
        ['convex', 'smooth', 'red', 'no', 'foul', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'poisonous'],
        ['convex', 'smooth', 'purple', 'no', 'foul', 'free', 'close', 'white', 'equal', 'smooth', 'smooth', 'white', 'white', 'partial', 'white', 'one', 'pendant', 'white', 'abundant', 'white', 'smooth', 'poisonous']
    ] * 100  # Simulate more data
    
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
    
    # Create DataFrame
    df = pd.DataFrame(sample_data, columns=feature_names + ['class'])
    
    print(f"Dataset shape: {df.shape}")
    print(f"Classes: {df['class'].value_counts().to_dict()}")
    print(f"Features: {len(feature_names)} categorical features")
    
    return df, feature_names

def encode_categorical_features(df, feature_names):
    """Encode categorical features to numerical values"""
    print("Encoding categorical features...")
    
    # Separate features and target
    X = df[feature_names].copy()
    y = df['class'].copy()
    
    # Encode each categorical feature
    encoders = {}
    X_encoded = X.copy()
    
    for feature in feature_names:
        le = LabelEncoder()
        X_encoded[feature] = le.fit_transform(X[feature])
        encoders[feature] = le
        print(f"  {feature}: {len(le.classes_)} unique values")
    
    # Encode target variable
    le_target = LabelEncoder()
    y_encoded = le_target.fit_transform(y)
    
    print(f"Target classes: {le_target.classes_}")
    
    return X_encoded, y_encoded, encoders, le_target

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
        
        # Get top features
        top_indices = np.argsort(log_probs)[-top_n:][::-1]
        top_features = []
        
        for idx in top_indices:
            feature_name = feature_names[idx]
            # Get the most important category for this feature
            feature_categories = encoders[feature_name].classes_
            category_probs = model.feature_log_prob_[i][idx]
            
            top_features.append({
                'feature': feature_name,
                'log_prob': category_probs,
                'categories': feature_categories
            })
        
        feature_importance[class_name] = top_features
        print(f"\nTop {top_n} features for '{class_name}':")
        for feat in top_features:
            print(f"  {feat['feature']}: {feat['log_prob']:.4f}")
    
    return feature_importance

def predict_mushroom_safety(model, encoders, le_target, mushroom_features):
    """Predict safety for a specific mushroom"""
    print(f"Predicting safety for mushroom with features: {mushroom_features}")
    
    # Encode the input features
    encoded_features = []
    for i, (feature_name, value) in enumerate(mushroom_features.items()):
        if feature_name in encoders:
            try:
                encoded_value = encoders[feature_name].transform([value])[0]
                encoded_features.append(encoded_value)
            except ValueError:
                print(f"Warning: Unknown value '{value}' for feature '{feature_name}'")
                # Use most common value as default
                encoded_features.append(0)
        else:
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
    
    # Example mushrooms
    example_mushrooms = [
        {
            'name': 'Safe Mushroom',
            'features': {
                'cap-shape': 'convex',
                'cap-surface': 'smooth',
                'cap-color': 'brown',
                'bruises': 'no',
                'odor': 'none'
            }
        },
        {
            'name': 'Dangerous Mushroom',
            'features': {
                'cap-shape': 'convex',
                'cap-surface': 'smooth',
                'cap-color': 'red',
                'bruises': 'no',
                'odor': 'foul'
            }
        },
        {
            'name': 'Questionable Mushroom',
            'features': {
                'cap-shape': 'flat',
                'cap-surface': 'scaly',
                'cap-color': 'yellow',
                'bruises': 'bruises',
                'odor': 'musty'
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
    print("=" * 60)
    print("Mushroom Classification with Categorical Naive Bayes")
    print("=" * 60)
    
    # 1. Load data
    df, feature_names = load_mushroom_data()
    
    # 2. Encode categorical features
    X_encoded, y_encoded, encoders, le_target = encode_categorical_features(df, feature_names)
    
    # 3. Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # 4. Train model
    model = train_model(X_train, y_train)
    
    # 5. Evaluate model
    y_pred, accuracy = evaluate_model(model, X_test, y_test, le_target)
    
    # 6. Feature importance
    feature_importance = get_feature_importance(model, feature_names, encoders, top_n=10)
    
    # 7. Safety checker demo
    safety_checker_demo(model, encoders, le_target)
    
    print("\n" + "=" * 60)
    print("⚠️  IMPORTANT SAFETY NOTICE")
    print("=" * 60)
    print("This is a DEMONSTRATION for educational purposes only.")
    print("NEVER use this model for real mushroom identification!")
    print("Always consult with mycologists and field guides.")
    print("Mistakes in mushroom identification can be FATAL!")
    print("=" * 60)
    
    print("\n" + "=" * 60)
    print("Analysis completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
