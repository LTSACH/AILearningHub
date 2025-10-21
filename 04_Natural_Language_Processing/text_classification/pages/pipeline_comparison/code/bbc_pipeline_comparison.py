"""
BBC News Classification - Pipeline Comparison
Compare 240 different ML pipelines for text classification

Author: AI Learning Hub
License: MIT
URL: https://ltsach.github.io/AILearningHub
"""

import os
import time
import numpy as np
import pandas as pd
from pathlib import Path

# Feature Extraction
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

# Dimensionality Reduction
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, chi2

# Classifiers
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier

# Evaluation
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report

# Visualization
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots


#================================================
# STEP 1: Download Dataset
#================================================

def download_dataset():
    """Download BBC News dataset from GitHub Pages"""
    print("📥 Downloading BBC News dataset...")
    
    base_url = 'https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/'
    files = ['train.csv', 'val.csv', 'test.csv']
    
    os.makedirs('data', exist_ok=True)
    
    for filename in files:
        filepath = f'data/{filename}'
        if not os.path.exists(filepath):
            import urllib.request
            url = base_url + filename
            urllib.request.urlretrieve(url, filepath)
            print(f"   ✅ Downloaded {filename}")
        else:
            print(f"   ⏭️  {filename} already exists")
    
    print("✅ Dataset ready!\n")


#================================================
# STEP 2: Load Data
#================================================

def load_data():
    """Load and prepare dataset"""
    print("📂 Loading data...")
    
    train_df = pd.read_csv('data/train.csv')
    test_df = pd.read_csv('data/test.csv')
    
    X_train = train_df['text'].values
    y_train = train_df['category'].values
    X_test = test_df['text'].values
    y_test = test_df['category'].values
    
    print(f"   Train samples: {len(X_train)}")
    print(f"   Test samples: {len(X_test)}")
    print(f"   Classes: {sorted(set(y_train))}\n")
    
    return X_train, y_train, X_test, y_test


#================================================
# STEP 3: Define Pipeline Configurations
#================================================

EXTRACTORS = {
    'bow': {
        'name': 'Bag of Words',
        'class': CountVectorizer,
        'configs': [
            {'max_features': 10000, 'ngram_range': (1, 1), 'min_df': 2},
            {'max_features': 5000, 'ngram_range': (1, 2), 'min_df': 2},
            {'max_features': 10000, 'ngram_range': (1, 2), 'min_df': 2},
        ]
    },
    'tfidf': {
        'name': 'TF-IDF',
        'class': TfidfVectorizer,
        'configs': [
            {'max_features': 10000, 'ngram_range': (1, 1), 'min_df': 2, 'max_df': 0.8},
            {'max_features': 5000, 'ngram_range': (1, 2), 'min_df': 2, 'max_df': 0.8},
            {'max_features': 10000, 'ngram_range': (1, 2), 'min_df': 2, 'max_df': 0.8}
        ]
    }
}

REDUCERS = {
    'none': {
        'name': 'None',
        'class': None,
        'configs': [{}]
    },
    'chi2': {
        'name': 'Chi²',
        'class': SelectKBest,
        'configs': [
            {'score_func': chi2, 'k': 1000},
        ]
    },
    'pca': {
        'name': 'PCA',
        'class': PCA,
        'configs': [
            {'n_components': 0.90, 'svd_solver': 'full'},  # 90% variance
            {'n_components': 0.95, 'svd_solver': 'full'},  # 95% variance
        ]
    }
}

CLASSIFIERS = {
    'naive_bayes': {
        'name': 'Naive Bayes',
        'class': MultinomialNB,
        'configs': [
            {'alpha': 1.0}
        ]
    },
    'logistic': {
        'name': 'Logistic Regression',
        'class': LogisticRegression,
        'configs': [
            {'C': 1.0, 'max_iter': 1000, 'random_state': 42},
            {'C': 10.0, 'max_iter': 1000, 'random_state': 42}
        ]
    },
    'random_forest': {
        'name': 'Random Forest',
        'class': RandomForestClassifier,
        'configs': [
            {'n_estimators': 100, 'max_depth': 10, 'random_state': 42, 'n_jobs': -1},
            {'n_estimators': 100, 'max_depth': 20, 'random_state': 42, 'n_jobs': -1}
        ]
    },
    'decision_tree': {
        'name': 'Decision Tree',
        'class': DecisionTreeClassifier,
        'configs': [
            {'max_depth': 10, 'random_state': 42},
            {'max_depth': 20, 'random_state': 42}
        ]
    },
    'knn': {
        'name': 'K-Nearest Neighbors',
        'class': KNeighborsClassifier,
        'configs': [
            {'n_neighbors': 3, 'n_jobs': -1},
            {'n_neighbors': 5, 'n_jobs': -1},
            {'n_neighbors': 10, 'n_jobs': -1}
        ]
    }
}


#================================================
# STEP 4: Train Pipeline
#================================================

def train_pipeline(X_train, y_train, X_test, y_test,
                  extractor_name, extractor_config,
                  reducer_name, reducer_config,
                  classifier_name, classifier_config):
    """Train a single pipeline and return results"""
    
    results = {
        'extractor': EXTRACTORS[extractor_name]['name'],
        'reducer': REDUCERS[reducer_name]['name'],
        'classifier': CLASSIFIERS[classifier_name]['name']
    }
    
    # Feature Extraction
    start_time = time.time()
    vectorizer = EXTRACTORS[extractor_name]['class'](**extractor_config)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    results['extraction_time'] = time.time() - start_time
    
    # Dimensionality Reduction
    if reducer_name != 'none':
        start_time = time.time()
        
        # Special handling for Chi² (needs dense, non-negative)
        if reducer_name == 'chi2':
            X_train_dense = X_train_vec.toarray() if hasattr(X_train_vec, 'toarray') else X_train_vec
            X_test_dense = X_test_vec.toarray() if hasattr(X_test_vec, 'toarray') else X_test_vec
            X_train_dense = np.abs(X_train_dense)
            X_test_dense = np.abs(X_test_dense)
            reducer = REDUCERS[reducer_name]['class'](**reducer_config)
            X_train_vec = reducer.fit_transform(X_train_dense, y_train)
            X_test_vec = reducer.transform(X_test_dense)
        else:
            reducer = REDUCERS[reducer_name]['class'](**reducer_config)
            X_train_vec = reducer.fit_transform(X_train_vec)
            X_test_vec = reducer.transform(X_test_vec)
        
        results['reduction_time'] = time.time() - start_time
    else:
        results['reduction_time'] = 0
    
    # Classification
    start_time = time.time()
    
    # Naive Bayes needs dense, non-negative
    if classifier_name == 'naive_bayes':
        if hasattr(X_train_vec, 'toarray'):
            X_train_vec = X_train_vec.toarray()
            X_test_vec = X_test_vec.toarray()
        X_train_vec = np.abs(X_train_vec)
        X_test_vec = np.abs(X_test_vec)
    
    classifier = CLASSIFIERS[classifier_name]['class'](**classifier_config)
    classifier.fit(X_train_vec, y_train)
    results['train_time'] = time.time() - start_time
    
    # Prediction
    start_time = time.time()
    y_pred = classifier.predict(X_test_vec)
    results['inference_time'] = (time.time() - start_time) / len(y_test) * 1000  # ms/sample
    
    # Metrics
    results['accuracy'] = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
    results['precision'] = precision
    results['recall'] = recall
    results['f1'] = f1
    
    return results


#================================================
# STEP 5: Run All Pipelines
#================================================

def run_all_pipelines(X_train, y_train, X_test, y_test, limit=None):
    """Run all pipeline combinations"""
    print("\n🚀 Training all pipeline combinations...\n")
    
    all_results = []
    count = 0
    
    for ext_name, ext_info in EXTRACTORS.items():
        for ext_config in ext_info['configs']:
            for red_name, red_info in REDUCERS.items():
                for red_config in red_info['configs']:
                    for clf_name, clf_info in CLASSIFIERS.items():
                        for clf_config in clf_info['configs']:
                            if limit and count >= limit:
                                print(f"\n⚠️  Reached limit of {limit} pipelines")
                                return all_results
                            
                            print(f"[{count+1}] {EXTRACTORS[ext_name]['name']} → "
                                  f"{REDUCERS[red_name]['name']} → "
                                  f"{CLASSIFIERS[clf_name]['name']}", end=' ... ')
                            
                            try:
                                results = train_pipeline(
                                    X_train, y_train, X_test, y_test,
                                    ext_name, ext_config,
                                    red_name, red_config,
                                    clf_name, clf_config
                                )
                                all_results.append(results)
                                print(f"✅ Acc: {results['accuracy']*100:.2f}%")
                            except Exception as e:
                                print(f"❌ Error: {e}")
                            
                            count += 1
    
    print(f"\n✅ Completed {count} pipelines!\n")
    return all_results


#================================================
# STEP 6: Generate Comparison Report
#================================================

def generate_comparison_report(results):
    """Generate HTML comparison report"""
    print("📊 Generating comparison report...\n")
    
    # Convert to DataFrame
    df = pd.DataFrame(results)
    
    # Sort by accuracy
    df = df.sort_values('accuracy', ascending=False)
    
    # Find best models
    best_accuracy = df.iloc[0]
    fastest_train = df.loc[df['train_time'].idxmin()]
    fastest_infer = df.loc[df['inference_time'].idxmin()]
    
    print("="*70)
    print("🏆 BEST PERFORMERS")
    print("="*70)
    print(f"\n📈 Best Accuracy: {best_accuracy['accuracy']*100:.2f}%")
    print(f"   {best_accuracy['extractor']} → {best_accuracy['reducer']} → {best_accuracy['classifier']}")
    print(f"\n⚡ Fastest Training: {fastest_train['train_time']:.3f}s")
    print(f"   {fastest_train['extractor']} → {fastest_train['reducer']} → {fastest_train['classifier']}")
    print(f"\n💨 Fastest Inference: {fastest_infer['inference_time']:.3f} ms/sample")
    print(f"   {fastest_infer['extractor']} → {fastest_infer['reducer']} → {fastest_infer['classifier']}")
    
    # Top 10 table
    print(f"\n\n{'='*70}")
    print("📊 TOP 10 PIPELINES BY ACCURACY")
    print("="*70)
    print(f"{'Rank':<6} {'Extractor':<15} {'Reducer':<10} {'Classifier':<20} {'Accuracy':<10}")
    print("-"*70)
    for idx, row in df.head(10).iterrows():
        print(f"{idx+1:<6} {row['extractor']:<15} {row['reducer']:<10} "
              f"{row['classifier']:<20} {row['accuracy']*100:>6.2f}%")
    
    # Save to CSV
    df.to_csv('pipeline_comparison_results.csv', index=False)
    print(f"\n✅ Results saved to: pipeline_comparison_results.csv\n")
    
    return df


#================================================
# MAIN EXECUTION
#================================================

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🔬 BBC NEWS PIPELINE COMPARISON")
    print("="*70 + "\n")
    
    # Download dataset
    download_dataset()
    
    # Load data
    X_train, y_train, X_test, y_test = load_data()
    
    # Run pipelines (set limit for quick test, remove for full comparison)
    results = run_all_pipelines(X_train, y_train, X_test, y_test, limit=10)  # Change to None for all 240
    
    # Generate report
    if results:
        df = generate_comparison_report(results)
    
    print("="*70)
    print("✅ PIPELINE COMPARISON COMPLETE!")
    print("="*70 + "\n")
