#!/usr/bin/env python3
"""
BBC News Pipeline Comparison
Compare feature extraction, dimensionality reduction, and classifier combinations

Dataset: BBC News (2225 articles, 5 categories)
Goal: Find optimal pipeline for text classification

Copyright (c) 2024 AI Learning Hub
https://ltsach.github.io/AILearningHub/
"""

# ===== AUTO-INSTALL DEPENDENCIES =====
import subprocess
import sys

def install_requirements():
    """Install required packages"""
    packages = ['scikit-learn', 'pandas', 'numpy', 'plotly']
    for pkg in packages:
        try:
            __import__(pkg.replace('-', '_'))
        except ImportError:
            print(f"📦 Installing {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", pkg])

install_requirements()

# ===== IMPORTS =====
import time
import urllib.request
from pathlib import Path

import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

# ===== DATASET DOWNLOAD =====
def download_bbc_news():
    """Download BBC News dataset from GitHub Pages"""
    print("\n" + "="*70)
    print("📥 DOWNLOADING BBC NEWS DATASET")
    print("="*70)
    
    base_url = 'https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/'
    files = ['train.csv', 'test.csv']
    
    data_dir = Path('bbc_data')
    data_dir.mkdir(exist_ok=True)
    
    for filename in files:
        filepath = data_dir / filename
        if filepath.exists():
            print(f"✓ {filename} already exists")
        else:
            print(f"⬇️  Downloading {filename}...")
            url = base_url + filename
            urllib.request.urlretrieve(url, filepath)
            print(f"✅ Downloaded {filename}")
    
    return data_dir

# ===== PIPELINE TRAINING =====
def train_pipeline(X_train, X_test, y_train, y_test, 
                   extractor, extractor_name,
                   reducer, reducer_name,
                   classifier, classifier_name):
    """Train a single pipeline and return results"""
    
    pipeline_name = f"{extractor_name} → {reducer_name} → {classifier_name}"
    print(f"\n🔬 {pipeline_name}")
    
    results = {
        'pipeline': pipeline_name,
        'extractor': extractor_name,
        'reducer': reducer_name,
        'classifier': classifier_name
    }
    
    try:
        # Step 1: Feature extraction
        start = time.time()
        X_train_vec = extractor.fit_transform(X_train)
        X_test_vec = extractor.transform(X_test)
        extract_time = time.time() - start
        
        features_before = X_train_vec.shape[1]
        
        # Step 2: Dimensionality reduction
        if reducer is not None:
            start = time.time()
            if reducer_name == 'Chi²':
                # Chi² needs non-negative, dense features
                X_train_vec = np.abs(X_train_vec.toarray())
                X_test_vec = np.abs(X_test_vec.toarray())
                X_train_vec = reducer.fit_transform(X_train_vec, y_train)
                X_test_vec = reducer.transform(X_test_vec)
            else:
                X_train_vec = reducer.fit_transform(X_train_vec)
                X_test_vec = reducer.transform(X_test_vec)
            reduce_time = time.time() - start
        else:
            reduce_time = 0
        
        features_after = X_train_vec.shape[1]
        
        # Step 3: Classification
        start = time.time()
        
        # Naive Bayes needs non-negative features
        if classifier_name == 'Naive Bayes':
            if hasattr(X_train_vec, 'toarray'):
                X_train_vec = X_train_vec.toarray()
                X_test_vec = X_test_vec.toarray()
            X_train_vec = np.abs(X_train_vec)
            X_test_vec = np.abs(X_test_vec)
        
        classifier.fit(X_train_vec, y_train)
        train_time = time.time() - start
        
        # Prediction
        start = time.time()
        y_pred = classifier.predict(X_test_vec)
        infer_time = (time.time() - start) / len(y_test) * 1000  # ms per sample
        
        # Metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
        cm = confusion_matrix(y_test, y_pred)
        
        results.update({
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'train_time': extract_time + reduce_time + train_time,
            'inference_ms': infer_time,
            'features_before': features_before,
            'features_after': features_after,
            'confusion_matrix': cm,
            'status': 'success'
        })
        
        print(f"   ✓ Accuracy: {accuracy*100:.2f}% | Train: {results['train_time']:.2f}s | Infer: {infer_time:.2f}ms")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results['status'] = 'failed'
        results['error'] = str(e)
    
    return results

# ===== MAIN TRAINING =====
def compare_pipelines():
    """Compare all pipeline combinations"""
    
    # Download data
    data_dir = download_bbc_news()
    
    # Load data
    print("\n" + "="*70)
    print("📂 LOADING DATA")
    print("="*70)
    
    train_df = pd.read_csv(data_dir / 'train.csv')
    test_df = pd.read_csv(data_dir / 'test.csv')
    
    X_train = train_df['text'].values
    y_train = train_df['category'].values
    X_test = test_df['text'].values
    y_test = test_df['category'].values
    
    print(f"Train: {len(X_train)} samples")
    print(f"Test: {len(X_test)} samples")
    print(f"Classes: {sorted(set(y_train))}")
    
    # Define pipeline components
    extractors = [
        (TfidfVectorizer(max_features=5000, ngram_range=(1,2), min_df=2, max_df=0.8), 'TF-IDF'),
        (CountVectorizer(max_features=5000, ngram_range=(1,2), min_df=2), 'BoW'),
    ]
    
    reducers = [
        (None, 'None'),
        (PCA(n_components=300), 'PCA'),
        (SelectKBest(score_func=chi2, k=500), 'Chi²'),
    ]
    
    classifiers = [
        (LogisticRegression(max_iter=1000, random_state=42), 'Logistic Regression'),
        (LinearSVC(max_iter=1000, random_state=42), 'SVM'),
        (MultinomialNB(), 'Naive Bayes'),
        (RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1), 'Random Forest'),
    ]
    
    # Train all combinations
    print("\n" + "="*70)
    print(f"🚀 TRAINING {len(extractors) * len(reducers) * len(classifiers)} PIPELINES")
    print("="*70)
    
    all_results = []
    
    for extractor, ext_name in extractors:
        for reducer, red_name in reducers:
            for classifier, clf_name in classifiers:
                # Clone objects for each pipeline
                from sklearn.base import clone
                ext = clone(extractor)
                red = clone(reducer) if reducer is not None else None
                clf = clone(classifier)
                
                result = train_pipeline(
                    X_train, X_test, y_train, y_test,
                    ext, ext_name, red, red_name, clf, clf_name
                )
                all_results.append(result)
    
    # Filter successful
    successful = [r for r in all_results if r.get('status') == 'success']
    
    print("\n" + "="*70)
    print(f"📊 SUMMARY: {len(successful)}/{len(all_results)} pipelines successful")
    print("="*70)
    
    return successful, y_test

# ===== VISUALIZATION =====
def generate_visualizations(results, y_test):
    """Generate comparison visualizations"""
    
    print("\n📊 Generating visualizations...")
    
    # Find best
    best_acc = max(results, key=lambda x: x['accuracy'])
    fastest = min(results, key=lambda x: x['train_time'])
    
    print(f"\n🏆 Best Accuracy: {best_acc['accuracy']*100:.2f}%")
    print(f"   Pipeline: {best_acc['pipeline']}")
    print(f"\n⚡ Fastest Training: {fastest['train_time']:.2f}s")
    print(f"   Pipeline: {fastest['pipeline']}")
    
    # 1. Accuracy comparison
    fig1 = go.Figure()
    fig1.add_trace(go.Bar(
        x=[r['pipeline'] for r in sorted(results, key=lambda x: -x['accuracy'])],
        y=[r['accuracy']*100 for r in sorted(results, key=lambda x: -x['accuracy'])],
        marker_color='#667eea',
        text=[f"{r['accuracy']*100:.2f}%" for r in sorted(results, key=lambda x: -x['accuracy'])],
        textposition='outside'
    ))
    fig1.update_layout(
        title='Pipeline Accuracy Comparison',
        xaxis_title='Pipeline',
        yaxis_title='Accuracy (%)',
        xaxis_tickangle=-45,
        height=600,
        yaxis_range=[75, 100]
    )
    fig1.show()
    
    # 2. Trade-off: Accuracy vs Speed
    fig2 = go.Figure()
    
    for reducer in set(r['reducer'] for r in results):
        filtered = [r for r in results if r['reducer'] == reducer]
        fig2.add_trace(go.Scatter(
            x=[r['train_time'] for r in filtered],
            y=[r['accuracy']*100 for r in filtered],
            mode='markers+text',
            name=reducer,
            text=[r['classifier'] for r in filtered],
            textposition='top center',
            marker=dict(size=12)
        ))
    
    fig2.update_layout(
        title='Trade-off: Accuracy vs Training Speed',
        xaxis_title='Training Time (seconds)',
        yaxis_title='Accuracy (%)',
        hovermode='closest',
        height=600,
        xaxis_type='log'
    )
    fig2.show()
    
    # 3. Heatmap: Classifier vs Extractor+Reducer
    extractors = sorted(set(r['extractor'] for r in results))
    reducers = sorted(set(r['reducer'] for r in results))
    classifiers = sorted(set(r['classifier'] for r in results))
    
    # Create matrix for heatmap
    x_labels = [f"{e}+{r}" for e in extractors for r in reducers]
    z_data = []
    
    for clf in classifiers:
        row = []
        for ext in extractors:
            for red in reducers:
                match = next((r for r in results 
                            if r['extractor']==ext and r['reducer']==red and r['classifier']==clf), None)
                row.append(match['accuracy']*100 if match else None)
        z_data.append(row)
    
    fig3 = go.Figure(data=go.Heatmap(
        z=z_data,
        x=x_labels,
        y=classifiers,
        colorscale='RdYlGn',
        text=[[f"{val:.1f}%" if val else "" for val in row] for row in z_data],
        texttemplate='%{text}',
        colorbar=dict(title='Accuracy (%)')
    ))
    
    fig3.update_layout(
        title='Accuracy Heatmap: Classifier vs Pipeline',
        xaxis_title='Extractor + Reducer',
        yaxis_title='Classifier',
        height=500,
        xaxis_tickangle=-45
    )
    fig3.show()
    
    # 4. Confusion matrices for top 3
    top3 = sorted(results, key=lambda x: -x['accuracy'])[:3]
    
    fig4 = make_subplots(
        rows=1, cols=3,
        subplot_titles=[f"{r['pipeline']}<br>Acc: {r['accuracy']*100:.1f}%" for r in top3],
        specs=[[{'type': 'heatmap'}]*3]
    )
    
    labels = sorted(set(y_test))
    
    for idx, r in enumerate(top3, 1):
        fig4.add_trace(
            go.Heatmap(
                z=r['confusion_matrix'],
                x=labels,
                y=labels,
                colorscale='Blues',
                showscale=(idx==3)
            ),
            row=1, col=idx
        )
    
    fig4.update_xaxes(title_text='Predicted')
    fig4.update_yaxes(title_text='True')
    fig4.update_layout(height=400, title_text='Top 3 Pipelines - Confusion Matrices')
    fig4.show()
    
    print("\n✅ Visualizations complete!")

# ===== RUN =====
if __name__ == '__main__':
    print("="*70)
    print("🔬 BBC NEWS PIPELINE COMPARISON")
    print("="*70)
    
    results, y_test = compare_pipelines()
    generate_visualizations(results, y_test)
    
    print("\n" + "="*70)
    print("✅ ALL DONE!")
    print("="*70)
    print("\n💡 Key Insights:")
    print("   • TF-IDF usually outperforms BoW")
    print("   • Dimensionality reduction trades accuracy for speed")
    print("   • Logistic Regression: best balance of accuracy & speed")
    print("   • Naive Bayes: fastest but slightly lower accuracy")
    print("   • Random Forest: slowest with minimal benefit")
