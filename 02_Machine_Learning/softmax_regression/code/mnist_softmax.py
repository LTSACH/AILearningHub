"""
MNIST Digit Classification using Softmax Regression
=================================================

This script demonstrates multiclass classification using Softmax Regression
on the MNIST handwritten digits dataset.

Features:
- Load MNIST dataset
- Data preprocessing and normalization
- Softmax Regression implementation
- Model evaluation and visualization
- Performance analysis
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
import time
import warnings
warnings.filterwarnings('ignore')

def load_mnist_data():
    """Load and prepare MNIST dataset"""
    print("=" * 60)
    print("🔢 LOADING MNIST DATASET")
    print("=" * 60)
    
    try:
        # Load MNIST dataset
        print("Loading MNIST dataset from OpenML...")
        mnist = fetch_openml('mnist_784', version=1, as_frame=False, parser='auto')
        X, y = mnist.data, mnist.target.astype(int)
        
        print(f"✅ Dataset loaded successfully!")
        print(f"Dataset shape: {X.shape}")
        print(f"Features: 28x28 pixel values (flattened to 784)")
        print(f"Classes: {np.unique(y)} (digits 0-9)")
        print(f"Class distribution: {np.bincount(y)}")
        
        # Show sample images
        print(f"\n📊 Sample images:")
        fig, axes = plt.subplots(2, 5, figsize=(10, 4))
        for i in range(10):
            row, col = i // 5, i % 5
            axes[row, col].imshow(X[i].reshape(28, 28), cmap='gray')
            axes[row, col].set_title(f'Digit: {y[i]}')
            axes[row, col].axis('off')
        plt.tight_layout()
        plt.show()
        
    except Exception as e:
        print(f"❌ Error loading MNIST: {e}")
        print("Creating synthetic MNIST-like dataset...")
        X, y = create_synthetic_mnist()
    
    return X, y

def create_synthetic_mnist():
    """Create synthetic MNIST-like dataset for demonstration"""
    print("🔧 Creating synthetic MNIST-like dataset...")
    
    np.random.seed(42)
    n_samples = 10000
    n_features = 784  # 28x28
    
    # Generate random pixel values
    X = np.random.randint(0, 256, (n_samples, n_features))
    
    # Generate random labels
    y = np.random.randint(0, 10, n_samples)
    
    print(f"Synthetic dataset created: {X.shape[0]} samples, {X.shape[1]} features")
    return X, y

def preprocess_data(X, y, test_size=0.2, val_size=0.2, random_state=42, max_samples=None):
    """Preprocess and split data"""
    print("=" * 60)
    print("🔧 PREPROCESSING DATA")
    print("=" * 60)
    
    # Limit samples for faster processing if specified
    if max_samples and len(X) > max_samples:
        print(f"Limiting dataset to {max_samples} samples for faster processing...")
        indices = np.random.choice(len(X), max_samples, replace=False)
        X, y = X[indices], y[indices]
    
    # Normalize pixel values to [0, 1]
    X_normalized = X.astype(np.float32) / 255.0
    
    print("Pixel values normalized to [0, 1] range")
    
    # Split data
    X_temp, X_test, y_temp, y_test = train_test_split(
        X_normalized, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    val_size_adjusted = val_size / (1 - test_size)
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=val_size_adjusted, random_state=random_state, stratify=y_temp
    )
    
    print(f"Data split:")
    print(f"  Training set:   {X_train.shape[0]:4d} samples ({X_train.shape[0]/len(X)*100:.1f}%)")
    print(f"  Validation set: {X_val.shape[0]:4d} samples ({X_val.shape[0]/len(X)*100:.1f}%)")
    print(f"  Test set:       {X_test.shape[0]:4d} samples ({X_test.shape[0]/len(X)*100:.1f}%)")
    
    return X_train, X_val, X_test, y_train, y_val, y_test

def train_softmax_regression(X_train, y_train, random_state=42):
    """Train Softmax Regression model"""
    print("=" * 60)
    print("🤖 TRAINING SOFTMAX REGRESSION")
    print("=" * 60)
    
    start_time = time.time()
    
    # Use LogisticRegression with multi_class='multinomial' for softmax
    model = LogisticRegression(
        multi_class='multinomial',
        solver='lbfgs',
        random_state=random_state,
        max_iter=1000
    )
    
    print("Training model... (this may take a while for large datasets)")
    model.fit(X_train, y_train)
    
    training_time = time.time() - start_time
    
    print("✅ Model training completed!")
    print(f"Training time: {training_time:.2f} seconds")
    print(f"Model classes: {model.classes_}")
    print(f"Number of features: {model.n_features_in_}")
    print(f"Intercept shape: {model.intercept_.shape}")
    print(f"Coefficients shape: {model.coef_.shape}")
    
    return model, training_time

def evaluate_model(model, X_test, y_test, training_time):
    """Evaluate model performance"""
    print("=" * 60)
    print("📈 MODEL EVALUATION")
    print("=" * 60)
    
    start_time = time.time()
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)
    
    prediction_time = time.time() - start_time
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"🎯 Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"⚡ Prediction time: {prediction_time:.4f} seconds")
    print(f"📊 Predictions per second: {len(X_test)/prediction_time:.0f}")
    
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
    
    return y_pred, y_proba, accuracy, prediction_time

def visualize_results(X_test, y_test, y_pred, n_samples=10):
    """Visualize classification results"""
    print("=" * 60)
    print("📊 VISUALIZING RESULTS")
    print("=" * 60)
    
    # Create confusion matrix heatmap
    plt.figure(figsize=(15, 5))
    
    plt.subplot(1, 3, 1)
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=range(10), yticklabels=range(10))
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    
    # Show sample predictions
    plt.subplot(1, 3, 2)
    indices = np.random.choice(len(X_test), n_samples, replace=False)
    for i, idx in enumerate(indices):
        plt.subplot(2, 5, i+1)
        plt.imshow(X_test[idx].reshape(28, 28), cmap='gray')
        plt.title(f'Pred: {y_pred[idx]}, True: {y_test[idx]}')
        plt.axis('off')
    
    # Accuracy by digit
    plt.subplot(1, 3, 3)
    digit_accuracy = []
    for digit in range(10):
        mask = y_test == digit
        if np.sum(mask) > 0:
            acc = accuracy_score(y_test[mask], y_pred[mask])
            digit_accuracy.append(acc)
        else:
            digit_accuracy.append(0)
    
    plt.bar(range(10), digit_accuracy)
    plt.title('Accuracy by Digit')
    plt.xlabel('Digit')
    plt.ylabel('Accuracy')
    plt.xticks(range(10))
    
    plt.tight_layout()
    plt.show()
    
    print("📊 Visualizations created successfully!")

def analyze_performance(model, X_test, y_test, training_time, prediction_time):
    """Analyze model performance characteristics"""
    print("=" * 60)
    print("🔍 PERFORMANCE ANALYSIS")
    print("=" * 60)
    
    # Model complexity
    n_params = model.coef_.size + model.intercept_.size
    print(f"Model Parameters: {n_params:,}")
    print(f"Parameters per class: {model.coef_.shape[0]:,}")
    print(f"Parameters per feature: {model.coef_.shape[1]:,}")
    
    # Training efficiency
    print(f"\nTraining Efficiency:")
    print(f"  Training time: {training_time:.2f} seconds")
    print(f"  Samples per second: {len(X_test)/training_time:.0f}")
    
    # Prediction efficiency
    print(f"\nPrediction Efficiency:")
    print(f"  Prediction time: {prediction_time:.4f} seconds")
    print(f"  Predictions per second: {len(X_test)/prediction_time:.0f}")
    
    # Memory usage estimation
    memory_mb = (model.coef_.nbytes + model.intercept_.nbytes) / (1024 * 1024)
    print(f"\nMemory Usage:")
    print(f"  Model size: {memory_mb:.2f} MB")
    
    # Feature importance analysis
    feature_importance = np.mean(np.abs(model.coef_), axis=0)
    most_important_pixels = np.argsort(feature_importance)[-10:]
    
    print(f"\nMost Important Pixels (by average |coefficient|):")
    for i, pixel_idx in enumerate(most_important_pixels):
        row, col = pixel_idx // 28, pixel_idx % 28
        print(f"  {i+1:2d}. Pixel ({row:2d}, {col:2d}): {feature_importance[pixel_idx]:.4f}")

def compare_with_other_algorithms(X_train, X_val, y_train, y_val):
    """Compare with other classification algorithms"""
    print("=" * 60)
    print("🔄 ALGORITHM COMPARISON")
    print("=" * 60)
    
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.svm import SVC
    from sklearn.naive_bayes import GaussianNB
    
    algorithms = {
        'Softmax Regression': LogisticRegression(multi_class='multinomial', solver='lbfgs', max_iter=100),
        'Random Forest': RandomForestClassifier(n_estimators=50, random_state=42),
        'SVM (RBF)': SVC(kernel='rbf', random_state=42),
        'Gaussian Naive Bayes': GaussianNB()
    }
    
    results = {}
    
    for name, model in algorithms.items():
        print(f"\nTraining {name}...")
        start_time = time.time()
        
        # Train model
        model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        # Evaluate on validation set
        start_time = time.time()
        y_pred = model.predict(X_val)
        prediction_time = time.time() - start_time
        
        accuracy = accuracy_score(y_val, y_pred)
        
        results[name] = {
            'accuracy': accuracy,
            'training_time': training_time,
            'prediction_time': prediction_time
        }
        
        print(f"  Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        print(f"  Training time: {training_time:.2f}s")
        print(f"  Prediction time: {prediction_time:.4f}s")
    
    # Find best algorithm
    best_algorithm = max(results, key=lambda x: results[x]['accuracy'])
    print(f"\n🏆 Best Algorithm: {best_algorithm} ({results[best_algorithm]['accuracy']:.4f})")
    
    return results

def main():
    """Main execution function"""
    print("=" * 80)
    print("🔢 MNIST CLASSIFICATION WITH SOFTMAX REGRESSION")
    print("=" * 80)
    
    # 1. Load data
    X, y = load_mnist_data()
    
    # 2. Preprocess data (limit to 5000 samples for faster processing)
    X_train, X_val, X_test, y_train, y_val, y_test = preprocess_data(X, y, max_samples=5000)
    
    # 3. Train model
    model, training_time = train_softmax_regression(X_train, y_train)
    
    # 4. Evaluate model
    y_pred, y_proba, accuracy, prediction_time = evaluate_model(model, X_test, y_test, training_time)
    
    # 5. Visualize results
    visualize_results(X_test, y_test, y_pred)
    
    # 6. Analyze performance
    analyze_performance(model, X_test, y_test, training_time, prediction_time)
    
    # 7. Compare algorithms
    results = compare_with_other_algorithms(X_train, X_val, y_train, y_val)
    
    # 8. Summary
    print("\n" + "=" * 80)
    print("📊 FINAL RESULTS SUMMARY")
    print("=" * 80)
    print(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Model Type: Softmax Regression (Multinomial Logistic Regression)")
    print(f"Features: 784 pixel values (28x28 images)")
    print(f"Classes: 10 digits (0-9)")
    print(f"Training Samples: {X_train.shape[0]}")
    print(f"Validation Samples: {X_val.shape[0]}")
    print(f"Test Samples: {X_test.shape[0]}")
    print(f"Training Time: {training_time:.2f} seconds")
    print(f"Prediction Time: {prediction_time:.4f} seconds")
    
    print("\n" + "=" * 80)
    print("✅ Analysis completed successfully!")
    print("=" * 80)
    
    return model, results

if __name__ == "__main__":
    main()
