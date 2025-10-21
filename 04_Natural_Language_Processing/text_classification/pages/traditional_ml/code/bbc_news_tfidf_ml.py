"""
BBC News Text Classification - TF-IDF + Traditional Machine Learning
Ready-to-run code with automatic dataset download

Copyright: AI Learning Hub  
Source: https://ltsach.github.io/AILearningHub/04_Natural_Language_Processing/text_classification/

Dataset: BBC News (2225 articles, 5 categories)
- Business, Entertainment, Politics, Sport, Tech
- Train: 1557 samples | Val: 334 samples | Test: 334 samples
"""

import time
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier

# For XGBoost (install if needed: pip install xgboost)
try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    print("⚠️  XGBoost not installed. Install with: pip install xgboost")
    XGBOOST_AVAILABLE = False


# ============================================================================
# 1. DATASET DOWNLOAD
# ============================================================================

def download_bbc_news():
    """Download BBC News dataset from GitHub Pages"""
    print("="*70)
    print("📥 DOWNLOADING BBC NEWS DATASET")
    print("="*70)
    
    base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbc-news/'
    
    try:
        train_df = pd.read_csv(base_url + 'train.csv')
        val_df = pd.read_csv(base_url + 'val.csv')
        test_df = pd.read_csv(base_url + 'test.csv')
        
        print(f"✓ Train: {len(train_df):,} samples")
        print(f"✓ Val: {len(val_df):,} samples")
        print(f"✓ Test: {len(test_df):,} samples")
        print(f"✓ Categories: {sorted(train_df['category'].unique().tolist())}")
        print()
        
        return train_df, val_df, test_df
    except Exception as e:
        print(f"❌ Failed to download dataset: {e}")
        print("\nPlease check your internet connection or dataset URL.")
        return None, None, None


# ============================================================================
# 2. FEATURE EXTRACTION
# ============================================================================

def extract_tfidf_features(train_texts, test_texts):
    """Extract TF-IDF features (same config as report)"""
    print("="*70)
    print("🔢 TF-IDF FEATURE EXTRACTION")
    print("="*70)
    
    start = time.time()
    
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),  # Unigrams + bigrams
        min_df=2,            # Min document frequency
        max_df=0.8,          # Max document frequency
        stop_words='english'
    )
    
    X_train = vectorizer.fit_transform(train_texts)
    X_test = vectorizer.transform(test_texts)
    
    elapsed = time.time() - start
    
    print(f"✓ Vocabulary size: {len(vectorizer.get_feature_names_out()):,} features")
    print(f"✓ Train shape: {X_train.shape}")
    print(f"✓ Test shape: {X_test.shape}")
    print(f"✓ Extraction time: {elapsed:.2f}s")
    print()
    
    return X_train, X_test, vectorizer


# ============================================================================
# 3. UTILITIES
# ============================================================================

def plot_confusion_matrix(cm, labels, title, save_path):
    """Plot and save confusion matrix"""
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=labels, yticklabels=labels, cbar=False)
    plt.title(f'Confusion Matrix - {title}', fontsize=14, fontweight='bold')
    plt.ylabel('True Label', fontsize=12)
    plt.xlabel('Predicted Label', fontsize=12)
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    print(f"  ✓ Confusion matrix saved: {save_path}")
    plt.close()


# ============================================================================
# 4. CLASSIFIERS
# ============================================================================

def train_naive_bayes(X_train, y_train, X_test, y_test):
    """Train Naive Bayes classifier"""
    print("="*70)
    print("🎲 NAIVE BAYES")
    print("="*70)
    
    start = time.time()
    model = MultinomialNB()
    model.fit(X_train, y_train)
    train_time = time.time() - start
    
    # Predict
    start = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"⏱️  Training: {train_time:.3f}s")
    print(f"⏱️  Inference: {inference_time:.3f}s ({inference_time/len(y_test)*1000:.2f}ms/sample)")
    print(f"📊 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print()
    print(classification_report(y_test, y_pred, zero_division=0))
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    plot_confusion_matrix(cm, sorted(y_test.unique()), 'Naive Bayes', 'naive_bayes_cm.png')
    
    return {'model': model, 'accuracy': accuracy, 'train_time': train_time, 'inference_time': inference_time}


def train_logistic_regression(X_train, y_train, X_test, y_test):
    """Train Logistic Regression"""
    print("="*70)
    print("📈 LOGISTIC REGRESSION")
    print("="*70)
    
    start = time.time()
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train, y_train)
    train_time = time.time() - start
    
    start = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start
    
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"⏱️  Training: {train_time:.3f}s")
    print(f"⏱️  Inference: {inference_time:.3f}s ({inference_time/len(y_test)*1000:.2f}ms/sample)")
    print(f"📊 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print()
    print(classification_report(y_test, y_pred, zero_division=0))
    
    cm = confusion_matrix(y_test, y_pred)
    plot_confusion_matrix(cm, sorted(y_test.unique()), 'Logistic Regression', 'logistic_regression_cm.png')
    
    return {'model': model, 'accuracy': accuracy, 'train_time': train_time, 'inference_time': inference_time}


def train_svm(X_train, y_train, X_test, y_test):
    """Train Support Vector Machine"""
    print("="*70)
    print("🎯 SUPPORT VECTOR MACHINE (SVM)")
    print("="*70)
    
    start = time.time()
    model = LinearSVC(max_iter=2000, random_state=42)
    model.fit(X_train, y_train)
    train_time = time.time() - start
    
    start = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start
    
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"⏱️  Training: {train_time:.3f}s")
    print(f"⏱️  Inference: {inference_time:.3f}s ({inference_time/len(y_test)*1000:.2f}ms/sample)")
    print(f"📊 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print()
    print(classification_report(y_test, y_pred, zero_division=0))
    
    cm = confusion_matrix(y_test, y_pred)
    plot_confusion_matrix(cm, sorted(y_test.unique()), 'SVM', 'svm_cm.png')
    
    return {'model': model, 'accuracy': accuracy, 'train_time': train_time, 'inference_time': inference_time}


def train_random_forest(X_train, y_train, X_test, y_test):
    """Train Random Forest"""
    print("="*70)
    print("🌲 RANDOM FOREST")
    print("="*70)
    
    start = time.time()
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    train_time = time.time() - start
    
    start = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start
    
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"⏱️  Training: {train_time:.3f}s")
    print(f"⏱️  Inference: {inference_time:.3f}s ({inference_time/len(y_test)*1000:.2f}ms/sample)")
    print(f"📊 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print()
    print(classification_report(y_test, y_pred, zero_division=0))
    
    cm = confusion_matrix(y_test, y_pred)
    plot_confusion_matrix(cm, sorted(y_test.unique()), 'Random Forest', 'random_forest_cm.png')
    
    return {'model': model, 'accuracy': accuracy, 'train_time': train_time, 'inference_time': inference_time}


def train_mlp(X_train, y_train, X_test, y_test):
    """Train Multi-Layer Perceptron (Neural Network)"""
    print("="*70)
    print("🧠 NEURAL NETWORK (MLP)")
    print("="*70)
    
    start = time.time()
    model = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
    model.fit(X_train, y_train)
    train_time = time.time() - start
    
    start = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start
    
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"⏱️  Training: {train_time:.3f}s")
    print(f"⏱️  Inference: {inference_time:.3f}s ({inference_time/len(y_test)*1000:.2f}ms/sample)")
    print(f"📊 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print()
    print(classification_report(y_test, y_pred, zero_division=0))
    
    cm = confusion_matrix(y_test, y_pred)
    plot_confusion_matrix(cm, sorted(y_test.unique()), 'MLP', 'mlp_cm.png')
    
    return {'model': model, 'accuracy': accuracy, 'train_time': train_time, 'inference_time': inference_time}


def train_xgboost(X_train, y_train, X_test, y_test):
    """Train XGBoost"""
    if not XGBOOST_AVAILABLE:
        print("⚠️  Skipping XGBoost (not installed)")
        return None
    
    print("="*70)
    print("🚀 XGBOOST")
    print("="*70)
    
    start = time.time()
    model = XGBClassifier(n_estimators=100, random_state=42, n_jobs=-1, verbosity=0)
    model.fit(X_train, y_train)
    train_time = time.time() - start
    
    start = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start
    
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"⏱️  Training: {train_time:.3f}s")
    print(f"⏱️  Inference: {inference_time:.3f}s ({inference_time/len(y_test)*1000:.2f}ms/sample)")
    print(f"📊 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print()
    print(classification_report(y_test, y_pred, zero_division=0))
    
    cm = confusion_matrix(y_test, y_pred)
    plot_confusion_matrix(cm, sorted(y_test.unique()), 'XGBoost', 'xgboost_cm.png')
    
    return {'model': model, 'accuracy': accuracy, 'train_time': train_time, 'inference_time': inference_time}


# ============================================================================
# 5. MAIN PIPELINE
# ============================================================================

def main():
    """Run all experiments"""
    print()
    print("="*70)
    print("🚀 BBC NEWS CLASSIFICATION - TF-IDF + TRADITIONAL ML")
    print("="*70)
    print()
    
    # 1. Download dataset
    train_df, val_df, test_df = download_bbc_news()
    if train_df is None:
        return
    
    # Combine train + val
    train_full = pd.concat([train_df, val_df], ignore_index=True)
    
    # 2. Extract TF-IDF features
    X_train, X_test, vectorizer = extract_tfidf_features(
        train_full['text'], 
        test_df['text']
    )
    y_train = train_full['category']
    y_test = test_df['category']
    
    # 3. Train all classifiers
    results = {}
    
    classifiers = [
        ('Naive Bayes', train_naive_bayes),
        ('Logistic Regression', train_logistic_regression),
        ('SVM', train_svm),
        ('Random Forest', train_random_forest),
        ('MLP', train_mlp),
        ('XGBoost', train_xgboost)
    ]
    
    for name, train_func in classifiers:
        result = train_func(X_train, y_train, X_test, y_test)
        if result:
            results[name] = result
        print()
    
    # 4. Summary
    print("="*70)
    print("📊 SUMMARY")
    print("="*70)
    print(f"{'Method':<20} {'Accuracy':<12} {'Train Time':<15} {'Inference Time'}")
    print("-"*70)
    for name, res in results.items():
        acc = f"{res['accuracy']*100:.2f}%"
        train_t = f"{res['train_time']:.2f}s"
        inf_t = f"{res['inference_time']*1000:.2f}ms"
        print(f"{name:<20} {acc:<12} {train_t:<15} {inf_t}")
    print("="*70)
    print()
    print("✅ ALL EXPERIMENTS COMPLETE!")
    print(f"✓ Confusion matrices saved as PNG files")
    print()


if __name__ == '__main__':
    main()
