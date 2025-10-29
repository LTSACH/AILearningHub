"""
Iris Dataset - Gaussian Naive Bayes Implementation
Complete example from data loading to prediction evaluation
"""

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pandas as pd
import numpy as np

def main():
    # 1. Load and explore the Iris dataset
    print("=" * 50)
    print("1. LOADING AND EXPLORING IRIS DATASET")
    print("=" * 50)
    
    iris = load_iris()
    X, y = iris.data, iris.target
    feature_names = iris.feature_names
    target_names = iris.target_names
    
    print(f"Dataset shape: {X.shape}")
    print(f"Features: {feature_names}")
    print(f"Classes: {target_names}")
    
    # Create DataFrame for better visualization
    df = pd.DataFrame(X, columns=feature_names)
    df['species'] = [target_names[i] for i in y]
    print("\nFirst 5 rows:")
    print(df.head())
    
    print("\nDataset statistics:")
    print(df.describe())
    
    # 2. Data preprocessing and splitting
    print("\n" + "=" * 50)
    print("2. DATA PREPROCESSING AND SPLITTING")
    print("=" * 50)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # Check class distribution
    print("\nClass distribution in training set:")
    unique, counts = np.unique(y_train, return_counts=True)
    for i, (cls, count) in enumerate(zip(target_names, counts)):
        print(f"{cls}: {count} samples ({count/len(y_train)*100:.1f}%)")
    
    # 3. Training Gaussian Naive Bayes
    print("\n" + "=" * 50)
    print("3. TRAINING GAUSSIAN NAIVE BAYES")
    print("=" * 50)
    
    # Initialize and train Gaussian Naive Bayes
    gnb = GaussianNB()
    gnb.fit(X_train, y_train)
    
    # Print model parameters
    print("Model Parameters:")
    print(f"Class priors: {gnb.class_prior_}")
    print(f"Number of classes: {len(gnb.classes_)}")
    print(f"Number of features: {gnb.n_features_in_}")
    
    # Show mean and variance for each class and feature
    print("\nClass means (theta):")
    for i, class_name in enumerate(target_names):
        print(f"{class_name}: {gnb.theta_[i]}")
        
    print("\nClass variances (sigma):")
    for i, class_name in enumerate(target_names):
        print(f"{class_name}: {gnb.var_[i]}")
    
    # 4. Making predictions and evaluation
    print("\n" + "=" * 50)
    print("4. PREDICTIONS AND EVALUATION")
    print("=" * 50)
    
    # Make predictions
    y_pred = gnb.predict(X_test)
    y_pred_proba = gnb.predict_proba(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.3f}")
    
    # Detailed classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=target_names))
    
    # Confusion matrix
    print("Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)
    
    # 5. Example prediction for new sample
    print("\n" + "=" * 50)
    print("5. PREDICTING NEW SAMPLES")
    print("=" * 50)
    
    # Example 1: Typical setosa
    new_sample_1 = [[5.1, 3.5, 1.4, 0.2]]  # [sepal_length, sepal_width, petal_length, petal_width]
    prediction_1 = gnb.predict(new_sample_1)
    probability_1 = gnb.predict_proba(new_sample_1)
    
    print(f"New sample 1: {new_sample_1[0]}")
    print(f"Predicted class: {target_names[prediction_1[0]]}")
    print(f"Class probabilities: {dict(zip(target_names, probability_1[0]))}")
    
    # Example 2: Typical versicolor
    new_sample_2 = [[6.4, 3.2, 4.5, 1.5]]
    prediction_2 = gnb.predict(new_sample_2)
    probability_2 = gnb.predict_proba(new_sample_2)
    
    print(f"\nNew sample 2: {new_sample_2[0]}")
    print(f"Predicted class: {target_names[prediction_2[0]]}")
    print(f"Class probabilities: {dict(zip(target_names, probability_2[0]))}")
    
    # Example 3: Typical virginica
    new_sample_3 = [[6.3, 3.3, 6.0, 2.5]]
    prediction_3 = gnb.predict(new_sample_3)
    probability_3 = gnb.predict_proba(new_sample_3)
    
    print(f"\nNew sample 3: {new_sample_3[0]}")
    print(f"Predicted class: {target_names[prediction_3[0]]}")
    print(f"Class probabilities: {dict(zip(target_names, probability_3[0]))}")
    
    # 6. Feature importance analysis
    print("\n" + "=" * 50)
    print("6. FEATURE IMPORTANCE ANALYSIS")
    print("=" * 50)
    
    # Calculate feature importance based on variance differences
    feature_importance = []
    for i in range(len(feature_names)):
        # Calculate average variance across all classes for this feature
        avg_variance = np.mean(gnb.var_[:, i])
        feature_importance.append(avg_variance)
    
    # Normalize importance scores
    feature_importance = np.array(feature_importance)
    feature_importance = feature_importance / np.sum(feature_importance)
    
    print("Feature importance (based on average variance):")
    for i, (feature, importance) in enumerate(zip(feature_names, feature_importance)):
        print(f"{feature}: {importance:.3f}")
    
    return gnb, X_test, y_test, y_pred

if __name__ == "__main__":
    model, X_test, y_test, y_pred = main()
