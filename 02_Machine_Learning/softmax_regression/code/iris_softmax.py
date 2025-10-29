"""
Iris Dataset Classification using Softmax Regression
==================================================

This script demonstrates multiclass classification using Softmax Regression
on the famous Iris dataset.

Features:
- Load Iris dataset from sklearn
- Train/Validation/Test split
- Softmax Regression implementation
- Model evaluation and visualization
- Comparison with other algorithms
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

def load_iris_data():
    """Load and prepare Iris dataset"""
    print("=" * 60)
    print("🌸 LOADING IRIS DATASET")
    print("=" * 60)
    
    # Load dataset
    iris = load_iris()
    X, y = iris.data, iris.target
    feature_names = iris.feature_names
    target_names = iris.target_names
    
    print(f"Dataset shape: {X.shape}")
    print(f"Features: {feature_names}")
    print(f"Classes: {target_names}")
    print(f"Class distribution: {np.bincount(y)}")
    
    # Create DataFrame for better visualization
    df = pd.DataFrame(X, columns=feature_names)
    df['species'] = [target_names[i] for i in y]
    
    print(f"\nFirst 5 rows:")
    print(df.head())
    
    return X, y, feature_names, target_names, df

def preprocess_data(X, y, test_size=0.2, val_size=0.2, random_state=42):
    """Preprocess and split data"""
    print("=" * 60)
    print("🔧 PREPROCESSING DATA")
    print("=" * 60)
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    print("Features standardized using StandardScaler")
    
    # Split data
    X_temp, X_test, y_temp, y_test = train_test_split(
        X_scaled, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    val_size_adjusted = val_size / (1 - test_size)
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=val_size_adjusted, random_state=random_state, stratify=y_temp
    )
    
    print(f"Data split:")
    print(f"  Training set:   {X_train.shape[0]:4d} samples ({X_train.shape[0]/len(X)*100:.1f}%)")
    print(f"  Validation set: {X_val.shape[0]:4d} samples ({X_val.shape[0]/len(X)*100:.1f}%)")
    print(f"  Test set:       {X_test.shape[0]:4d} samples ({X_test.shape[0]/len(X)*100:.1f}%)")
    
    return X_train, X_val, X_test, y_train, y_val, y_test, scaler

def train_softmax_regression(X_train, y_train, random_state=42):
    """Train Softmax Regression model"""
    print("=" * 60)
    print("🤖 TRAINING SOFTMAX REGRESSION")
    print("=" * 60)
    
    # Use LogisticRegression with multi_class='multinomial' for softmax
    model = LogisticRegression(
        multi_class='multinomial',
        solver='lbfgs',
        random_state=random_state,
        max_iter=1000
    )
    
    model.fit(X_train, y_train)
    
    print("✅ Model training completed!")
    print(f"Model classes: {model.classes_}")
    print(f"Number of features: {model.n_features_in_}")
    print(f"Intercept: {model.intercept_}")
    print(f"Coefficients shape: {model.coef_.shape}")
    
    return model

def evaluate_model(model, X_test, y_test, target_names):
    """Evaluate model performance"""
    print("=" * 60)
    print("📈 MODEL EVALUATION")
    print("=" * 60)
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"🎯 Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Classification report
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=target_names))
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\n📊 Confusion Matrix:")
    print(cm)
    
    # Show probability predictions for first 5 samples
    print(f"\n🔍 Probability Predictions (first 5 samples):")
    for i in range(min(5, len(y_proba))):
        print(f"Sample {i+1}: {y_proba[i]}")
        print(f"  Predicted: {target_names[y_pred[i]]}")
        print(f"  Actual: {target_names[y_test[i]]}")
        print()
    
    return y_pred, y_proba, accuracy

def visualize_results(X_test, y_test, y_pred, target_names, feature_names):
    """Visualize classification results"""
    print("=" * 60)
    print("📊 VISUALIZING RESULTS")
    print("=" * 60)
    
    # Create confusion matrix heatmap
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=target_names, yticklabels=target_names)
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    
    # Feature importance (coefficients)
    plt.subplot(1, 2, 2)
    model = LogisticRegression(multi_class='multinomial', solver='lbfgs')
    model.fit(X_test, y_test)
    
    # Average absolute coefficients across classes
    feature_importance = np.mean(np.abs(model.coef_), axis=0)
    
    plt.barh(feature_names, feature_importance)
    plt.title('Feature Importance (Average |Coefficients|)')
    plt.xlabel('Importance')
    
    plt.tight_layout()
    plt.show()
    
    print("📊 Visualizations created successfully!")

def compare_algorithms(X_train, X_val, y_train, y_val, target_names):
    """Compare different classification algorithms"""
    print("=" * 60)
    print("🔄 ALGORITHM COMPARISON")
    print("=" * 60)
    
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.svm import SVC
    from sklearn.naive_bayes import GaussianNB
    
    algorithms = {
        'Softmax Regression': LogisticRegression(multi_class='multinomial', solver='lbfgs'),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'SVM': SVC(kernel='rbf', random_state=42),
        'Gaussian Naive Bayes': GaussianNB()
    }
    
    results = {}
    
    for name, model in algorithms.items():
        # Train model
        model.fit(X_train, y_train)
        
        # Evaluate on validation set
        y_pred = model.predict(X_val)
        accuracy = accuracy_score(y_val, y_pred)
        
        results[name] = accuracy
        print(f"{name:20s}: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Find best algorithm
    best_algorithm = max(results, key=results.get)
    print(f"\n🏆 Best Algorithm: {best_algorithm} ({results[best_algorithm]:.4f})")
    
    return results

def main():
    """Main execution function"""
    print("=" * 80)
    print("🌸 IRIS CLASSIFICATION WITH SOFTMAX REGRESSION")
    print("=" * 80)
    
    # 1. Load data
    X, y, feature_names, target_names, df = load_iris_data()
    
    # 2. Preprocess data
    X_train, X_val, X_test, y_train, y_val, y_test, scaler = preprocess_data(X, y)
    
    # 3. Train model
    model = train_softmax_regression(X_train, y_train)
    
    # 4. Evaluate model
    y_pred, y_proba, accuracy = evaluate_model(model, X_test, y_test, target_names)
    
    # 5. Visualize results
    visualize_results(X_test, y_test, y_pred, target_names, feature_names)
    
    # 6. Compare algorithms
    results = compare_algorithms(X_train, X_val, y_train, y_val, target_names)
    
    # 7. Summary
    print("\n" + "=" * 80)
    print("📊 FINAL RESULTS SUMMARY")
    print("=" * 80)
    print(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Model Type: Softmax Regression (Multinomial Logistic Regression)")
    print(f"Features: {len(feature_names)} standardized features")
    print(f"Classes: {len(target_names)} species")
    print(f"Training Samples: {X_train.shape[0]}")
    print(f"Validation Samples: {X_val.shape[0]}")
    print(f"Test Samples: {X_test.shape[0]}")
    
    print("\n" + "=" * 80)
    print("✅ Analysis completed successfully!")
    print("=" * 80)
    
    return model, scaler, results

if __name__ == "__main__":
    main()
