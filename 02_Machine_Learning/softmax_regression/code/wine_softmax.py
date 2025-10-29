"""
Wine Quality Classification using Softmax Regression
===================================================

This script demonstrates multiclass classification using Softmax Regression
on the Wine Quality dataset.

Features:
- Load Wine Quality dataset
- Data preprocessing and feature engineering
- Softmax Regression implementation
- Model evaluation and visualization
- Handling imbalanced classes
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.utils.class_weight import compute_class_weight
import warnings
warnings.filterwarnings('ignore')

def load_wine_data():
    """Load and prepare Wine Quality dataset"""
    print("=" * 60)
    print("🍷 LOADING WINE QUALITY DATASET")
    print("=" * 60)
    
    try:
        # Load Wine Quality dataset
        print("Loading Wine Quality dataset from OpenML...")
        wine = fetch_openml('wine-quality-red', version=1, as_frame=True, parser='auto')
        df = wine.frame
        
        print(f"✅ Dataset loaded successfully!")
        print(f"Dataset shape: {df.shape}")
        print(f"Features: {list(df.columns[:-1])}")
        print(f"Target: {df.columns[-1]}")
        
        # Separate features and target
        X = df.iloc[:, :-1].values
        y = df.iloc[:, -1].values.astype(int)
        feature_names = list(df.columns[:-1])
        
        print(f"Classes: {np.unique(y)} (quality ratings)")
        print(f"Class distribution: {np.bincount(y)}")
        
        # Show class distribution
        class_counts = np.bincount(y)
        print(f"\nClass distribution details:")
        for i, count in enumerate(class_counts):
            if count > 0:
                percentage = (count / len(y)) * 100
                print(f"  Quality {i}: {count:4d} samples ({percentage:5.1f}%)")
        
        # Show basic statistics
        print(f"\nDataset statistics:")
        print(df.describe())
        
    except Exception as e:
        print(f"❌ Error loading Wine Quality dataset: {e}")
        print("Creating synthetic wine quality dataset...")
        X, y, feature_names = create_synthetic_wine_data()
    
    return X, y, feature_names

def create_synthetic_wine_data():
    """Create synthetic wine quality dataset for demonstration"""
    print("🔧 Creating synthetic wine quality dataset...")
    
    np.random.seed(42)
    n_samples = 2000
    
    # Feature names for wine quality
    feature_names = [
        'fixed_acidity', 'volatile_acidity', 'citric_acid', 'residual_sugar',
        'chlorides', 'free_sulfur_dioxide', 'total_sulfur_dioxide', 'density',
        'pH', 'sulphates', 'alcohol'
    ]
    
    # Generate synthetic features
    X = np.random.randn(n_samples, len(feature_names))
    
    # Generate quality scores (3-9) with some correlation to features
    # Higher alcohol and lower volatile acidity should lead to higher quality
    alcohol_effect = X[:, -1] * 0.5  # alcohol effect
    volatile_acidity_effect = -X[:, 1] * 0.3  # volatile acidity effect
    noise = np.random.randn(n_samples) * 0.5
    
    quality_scores = 3 + (alcohol_effect + volatile_acidity_effect + noise) * 2
    quality_scores = np.clip(quality_scores, 3, 9)
    y = quality_scores.astype(int)
    
    print(f"Synthetic dataset created: {X.shape[0]} samples, {X.shape[1]} features")
    return X, y, feature_names

def preprocess_data(X, y, test_size=0.2, val_size=0.2, random_state=42):
    """Preprocess and split data"""
    print("=" * 60)
    print("🔧 PREPROCESSING DATA")
    print("=" * 60)
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    print("Features standardized using StandardScaler")
    
    # Check for class imbalance
    class_counts = np.bincount(y)
    min_class_count = np.min(class_counts[class_counts > 0])
    print(f"Minimum class count: {min_class_count}")
    
    if min_class_count < 10:
        print("⚠️ Warning: Some classes have very few samples!")
    
    # Split data with stratification
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

def train_softmax_regression(X_train, y_train, class_weight='balanced', random_state=42):
    """Train Softmax Regression model"""
    print("=" * 60)
    print("🤖 TRAINING SOFTMAX REGRESSION")
    print("=" * 60)
    
    # Use LogisticRegression with multi_class='multinomial' for softmax
    model = LogisticRegression(
        multi_class='multinomial',
        solver='lbfgs',
        class_weight=class_weight,
        random_state=random_state,
        max_iter=1000
    )
    
    model.fit(X_train, y_train)
    
    print("✅ Model training completed!")
    print(f"Model classes: {model.classes_}")
    print(f"Number of features: {model.n_features_in_}")
    print(f"Class weights: {class_weight}")
    
    # Show class weights if balanced
    if class_weight == 'balanced':
        class_weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
        print(f"Computed class weights: {dict(zip(model.classes_, class_weights))}")
    
    return model

def evaluate_model(model, X_test, y_test, feature_names):
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
    print(classification_report(y_test, y_pred))
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\n📊 Confusion Matrix:")
    print(cm)
    
    # Show probability predictions for first 5 samples
    print(f"\n🔍 Probability Predictions (first 5 samples):")
    for i in range(min(5, len(y_proba))):
        print(f"Sample {i+1}: {y_proba[i]}")
        print(f"  Predicted: {y_pred[i]}")
        print(f"  Actual: {y_test[i]}")
        print()
    
    return y_pred, y_proba, accuracy

def visualize_results(X_test, y_test, y_pred, feature_names):
    """Visualize classification results"""
    print("=" * 60)
    print("📊 VISUALIZING RESULTS")
    print("=" * 60)
    
    plt.figure(figsize=(15, 10))
    
    # Confusion matrix
    plt.subplot(2, 3, 1)
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=sorted(np.unique(y_test)), 
                yticklabels=sorted(np.unique(y_test)))
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted Quality')
    plt.ylabel('Actual Quality')
    
    # Class distribution
    plt.subplot(2, 3, 2)
    unique_classes, counts = np.unique(y_test, return_counts=True)
    plt.bar(unique_classes, counts)
    plt.title('Test Set Class Distribution')
    plt.xlabel('Quality Rating')
    plt.ylabel('Count')
    
    # Accuracy by class
    plt.subplot(2, 3, 3)
    class_accuracy = []
    for quality in sorted(np.unique(y_test)):
        mask = y_test == quality
        if np.sum(mask) > 0:
            acc = accuracy_score(y_test[mask], y_pred[mask])
            class_accuracy.append(acc)
        else:
            class_accuracy.append(0)
    
    plt.bar(sorted(np.unique(y_test)), class_accuracy)
    plt.title('Accuracy by Quality Rating')
    plt.xlabel('Quality Rating')
    plt.ylabel('Accuracy')
    
    # Feature importance
    plt.subplot(2, 3, 4)
    feature_importance = np.mean(np.abs(model.coef_), axis=0)
    sorted_indices = np.argsort(feature_importance)[::-1]
    
    plt.barh(range(len(feature_names)), feature_importance[sorted_indices])
    plt.yticks(range(len(feature_names)), [feature_names[i] for i in sorted_indices])
    plt.title('Feature Importance (Average |Coefficients|)')
    plt.xlabel('Importance')
    
    # Prediction confidence distribution
    plt.subplot(2, 3, 5)
    max_proba = np.max(y_proba, axis=1)
    plt.hist(max_proba, bins=20, alpha=0.7, edgecolor='black')
    plt.title('Prediction Confidence Distribution')
    plt.xlabel('Maximum Probability')
    plt.ylabel('Count')
    
    # Quality vs Alcohol scatter plot
    plt.subplot(2, 3, 6)
    alcohol_idx = feature_names.index('alcohol') if 'alcohol' in feature_names else -1
    if alcohol_idx >= 0:
        plt.scatter(X_test[:, alcohol_idx], y_test, alpha=0.6, label='Actual')
        plt.scatter(X_test[:, alcohol_idx], y_pred, alpha=0.6, label='Predicted')
        plt.xlabel('Alcohol Content (standardized)')
        plt.ylabel('Quality Rating')
        plt.title('Quality vs Alcohol Content')
        plt.legend()
    
    plt.tight_layout()
    plt.show()
    
    print("📊 Visualizations created successfully!")

def analyze_class_imbalance(y_train, y_val, y_test):
    """Analyze class imbalance in the dataset"""
    print("=" * 60)
    print("⚖️ CLASS IMBALANCE ANALYSIS")
    print("=" * 60)
    
    datasets = {'Training': y_train, 'Validation': y_val, 'Test': y_test}
    
    for name, y in datasets.items():
        print(f"\n{name} Set:")
        unique_classes, counts = np.unique(y, return_counts=True)
        total = len(y)
        
        for cls, count in zip(unique_classes, counts):
            percentage = (count / total) * 100
            print(f"  Quality {cls}: {count:4d} samples ({percentage:5.1f}%)")
    
    # Calculate imbalance ratio
    all_classes = np.concatenate([y_train, y_val, y_test])
    unique_classes, counts = np.unique(all_classes, return_counts=True)
    max_count = np.max(counts)
    min_count = np.min(counts)
    imbalance_ratio = max_count / min_count
    
    print(f"\nImbalance Ratio: {imbalance_ratio:.2f}")
    if imbalance_ratio > 10:
        print("⚠️ Severe class imbalance detected!")
    elif imbalance_ratio > 3:
        print("⚠️ Moderate class imbalance detected!")
    else:
        print("✅ Class distribution is relatively balanced!")

def compare_class_weight_strategies(X_train, X_val, y_train, y_val):
    """Compare different class weight strategies"""
    print("=" * 60)
    print("⚖️ CLASS WEIGHT STRATEGY COMPARISON")
    print("=" * 60)
    
    strategies = {
        'No weights': None,
        'Balanced': 'balanced',
        'Balanced subsample': 'balanced_subsample'
    }
    
    results = {}
    
    for name, class_weight in strategies.items():
        print(f"\nTesting {name}...")
        
        model = LogisticRegression(
            multi_class='multinomial',
            solver='lbfgs',
            class_weight=class_weight,
            random_state=42,
            max_iter=1000
        )
        
        model.fit(X_train, y_train)
        y_pred = model.predict(X_val)
        accuracy = accuracy_score(y_val, y_pred)
        
        results[name] = accuracy
        print(f"  Validation Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Find best strategy
    best_strategy = max(results, key=results.get)
    print(f"\n🏆 Best Strategy: {best_strategy} ({results[best_strategy]:.4f})")
    
    return results

def main():
    """Main execution function"""
    print("=" * 80)
    print("🍷 WINE QUALITY CLASSIFICATION WITH SOFTMAX REGRESSION")
    print("=" * 80)
    
    # 1. Load data
    X, y, feature_names = load_wine_data()
    
    # 2. Preprocess data
    X_train, X_val, X_test, y_train, y_val, y_test, scaler = preprocess_data(X, y)
    
    # 3. Analyze class imbalance
    analyze_class_imbalance(y_train, y_val, y_test)
    
    # 4. Compare class weight strategies
    weight_results = compare_class_weight_strategies(X_train, X_val, y_train, y_val)
    
    # 5. Train model with best strategy
    best_strategy = max(weight_results, key=weight_results.get)
    class_weight = None if best_strategy == 'No weights' else best_strategy
    model = train_softmax_regression(X_train, y_train, class_weight=class_weight)
    
    # 6. Evaluate model
    y_pred, y_proba, accuracy = evaluate_model(model, X_test, y_test, feature_names)
    
    # 7. Visualize results
    visualize_results(X_test, y_test, y_pred, feature_names)
    
    # 8. Summary
    print("\n" + "=" * 80)
    print("📊 FINAL RESULTS SUMMARY")
    print("=" * 80)
    print(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Model Type: Softmax Regression (Multinomial Logistic Regression)")
    print(f"Class Weight Strategy: {best_strategy}")
    print(f"Features: {len(feature_names)} standardized features")
    print(f"Classes: {len(np.unique(y))} quality ratings")
    print(f"Training Samples: {X_train.shape[0]}")
    print(f"Validation Samples: {X_val.shape[0]}")
    print(f"Test Samples: {X_test.shape[0]}")
    
    print("\n" + "=" * 80)
    print("✅ Analysis completed successfully!")
    print("=" * 80)
    
    return model, scaler, weight_results

if __name__ == "__main__":
    main()
