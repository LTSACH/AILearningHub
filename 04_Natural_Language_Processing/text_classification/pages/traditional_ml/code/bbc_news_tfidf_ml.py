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
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier

# XGBoost (optional)
try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    print("⚠️  XGBoost not installed. Install with: pip install xgboost")
    XGBOOST_AVAILABLE = False


# ============================================================================
# DATASET DOWNLOAD
# ============================================================================

def download_bbc_news():
    """Download BBC News dataset from GitHub Pages"""
    print("="*70)
    print("📥 DOWNLOADING BBC NEWS DATASET")
    print("="*70)
    
    base_url = 'https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/'
    
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
        print(f"❌ Failed to download: {e}")
        return None, None, None


# ============================================================================
# FEATURE EXTRACTION
# ============================================================================

def extract_tfidf_features(train_texts, test_texts):
    """Extract TF-IDF features"""
    print("="*70)
    print("🔢 TF-IDF FEATURE EXTRACTION")
    print("="*70)
    
    start = time.time()
    
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.8,
        stop_words='english'
    )
    
    X_train = vectorizer.fit_transform(train_texts)
    X_test = vectorizer.transform(test_texts)
    
    elapsed = time.time() - start
    
    print(f"✓ Vocabulary: {len(vectorizer.get_feature_names_out()):,} features")
    print(f"✓ Train shape: {X_train.shape}")
    print(f"✓ Test shape: {X_test.shape}")
    print(f"✓ Time: {elapsed:.2f}s")
    print()
    
    return X_train, X_test, vectorizer


# ============================================================================
# CLASSIFIERS
# ============================================================================

def train_classifier(name, model, X_train, y_train, X_test, y_test):
    """Train and evaluate a classifier"""
    print("="*70)
    print(f"{name.upper()}")
    print("="*70)
    
    # Train
    start = time.time()
    model.fit(X_train, y_train)
    train_time = time.time() - start
    
    # Predict
    start = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    
    print(f"⏱️  Training: {train_time:.2f}s")
    print(f"⏱️  Inference: {inference_time:.3f}s ({inference_time/len(y_test)*1000:.2f}ms/sample)")
    print(f"📊 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print()
    
    return {
        'name': name,
        'model': model,
        'accuracy': accuracy,
        'train_time': train_time,
        'inference_time': inference_time,
        'y_pred': y_pred,
        'confusion_matrix': cm
    }


# ============================================================================
# VISUALIZATION
# ============================================================================

def plot_confusion_matrix_plotly(cm, labels, title):
    """Create Plotly confusion matrix heatmap"""
    fig = go.Figure(data=go.Heatmap(
        z=cm,
        x=labels,
        y=labels,
        colorscale='Blues',
        showscale=True,
        text=cm,
        texttemplate='%{text}',
        textfont={"size": 14},
        hovertemplate='True: %{y}<br>Pred: %{x}<br>Count: %{z}<extra></extra>'
    ))
    
    fig.update_layout(
        title=f'Confusion Matrix - {title}',
        xaxis_title='Predicted',
        yaxis_title='True Label',
        width=600,
        height=500,
        font=dict(size=12)
    )
    
    return fig


def create_comparison_chart(results):
    """Create comparison bar chart"""
    names = [r['name'] for r in results]
    accuracies = [r['accuracy']*100 for r in results]
    train_times = [r['train_time'] for r in results]
    
    fig = make_subplots(
        rows=1, cols=2,
        subplot_titles=('Accuracy Comparison', 'Training Time Comparison'),
        specs=[[{"type": "bar"}, {"type": "bar"}]]
    )
    
    # Accuracy
    fig.add_trace(
        go.Bar(x=names, y=accuracies, name='Accuracy (%)',
               marker_color='rgb(102, 126, 234)',
               text=[f'{a:.2f}%' for a in accuracies],
               textposition='outside'),
        row=1, col=1
    )
    
    # Training time
    fig.add_trace(
        go.Bar(x=names, y=train_times, name='Time (s)',
               marker_color='rgb(245, 135, 108)',
               text=[f'{t:.2f}s' for t in train_times],
               textposition='outside'),
        row=1, col=2
    )
    
    fig.update_layout(
        title_text="Performance Comparison",
        showlegend=False,
        height=400,
        font=dict(size=12)
    )
    
    fig.update_yaxes(title_text="Accuracy (%)", row=1, col=1)
    fig.update_yaxes(title_text="Time (seconds)", row=1, col=2)
    
    return fig


# ============================================================================
# HTML REPORT
# ============================================================================

def generate_html_report(results, y_test):
    """Generate HTML report with interactive plots"""
    labels = sorted(y_test.unique())
    
    # Use raw string to avoid # interpretation
    css_style = """
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #333; text-align: center; }
        .summary { background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .summary table { width: 100%; border-collapse: collapse; }
        .summary th, .summary td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .summary th { background: #667eea; color: white; }
        .chart-container { margin: 30px 0; }
        .cm-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(600px, 1fr)); gap: 20px; }
    """
    
    html_parts = ["""
<!DOCTYPE html>
<html>
<head>
    <title>BBC News Classification Results</title>
    <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
    <style>
""" + css_style + """
    </style>
</head>
<body>
    <div class="container">
        <h1>BBC News Text Classification Results</h1>
        <p style="text-align: center; color: #666;">TF-IDF + Traditional Machine Learning</p>
        
        <div class="summary">
            <h2>Summary</h2>
            <table>
                <tr><th>Method</th><th>Accuracy</th><th>Train Time</th><th>Inference Time</th></tr>
"""]
    
    for r in results:
        html_parts.append(f"""
                <tr>
                    <td><strong>{r['name']}</strong></td>
                    <td>{r['accuracy']*100:.2f}%</td>
                    <td>{r['train_time']:.2f}s</td>
                    <td>{r['inference_time']*1000:.2f}ms</td>
                </tr>
""")
    
    html_parts.append("""
            </table>
        </div>
        
        <div class="chart-container">
            <h2>Performance Comparison</h2>
            <div id="comparison-chart"></div>
        </div>
        
        <div class="chart-container">
            <h2>Confusion Matrices</h2>
            <div class="cm-grid">
""")
    
    # Confusion matrices
    for i, r in enumerate(results):
        html_parts.append(f'                <div id="cm-{i}"></div>\n')
    
    html_parts.append("""
            </div>
        </div>
    </div>
    
    <script>
""")
    
    # Comparison chart
    comp_fig = create_comparison_chart(results)
    html_parts.append(f"        var compData = {comp_fig.to_json()};\n")
    html_parts.append("        Plotly.newPlot('comparison-chart', compData.data, compData.layout);\n\n")
    
    # Confusion matrices
    for i, r in enumerate(results):
        cm_fig = plot_confusion_matrix_plotly(r['confusion_matrix'], labels, r['name'])
        html_parts.append(f"        var cmData{i} = {cm_fig.to_json()};\n")
        html_parts.append(f"        Plotly.newPlot('cm-{i}', cmData{i}.data, cmData{i}.layout);\n\n")
    
    html_parts.append("""
    </script>
</body>
</html>
""")
    
    return ''.join(html_parts)


# ============================================================================
# MAIN
# ============================================================================

def main():
    """Run all experiments"""
    print()
    print("="*70)
    print("🚀 BBC NEWS CLASSIFICATION")
    print("="*70)
    print()
    
    # Download
    train_df, val_df, test_df = download_bbc_news()
    if train_df is None:
        return
    
    # Combine train + val
    train_full = pd.concat([train_df, val_df], ignore_index=True)
    
    # Extract features
    X_train, X_test, vectorizer = extract_tfidf_features(
        train_full['text'], test_df['text']
    )
    y_train = train_full['category']
    y_test = test_df['category']
    
    # Train classifiers
    classifiers = [
        ('Naive Bayes', MultinomialNB()),
        ('Logistic Regression', LogisticRegression(max_iter=1000, random_state=42)),
        ('SVM', LinearSVC(max_iter=2000, random_state=42)),
        ('Random Forest', RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)),
        ('MLP', MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)),
    ]
    
    if XGBOOST_AVAILABLE:
        classifiers.append(('XGBoost', XGBClassifier(n_estimators=100, random_state=42, n_jobs=-1, verbosity=0)))
    
    results = []
    for name, model in classifiers:
        result = train_classifier(name, model, X_train, y_train, X_test, y_test)
        results.append(result)
        print()
    
    # Generate HTML report
    print("="*70)
    print("📄 GENERATING HTML REPORT")
    print("="*70)
    html_report = generate_html_report(results, y_test)
    
    with open('classification_results.html', 'w') as f:
        f.write(html_report)
    
    print("✓ Report saved: classification_results.html")
    print()
    print("="*70)
    print("✅ ALL COMPLETE!")
    print("="*70)
    print()
    print("📋 Next steps:")
    print("  1. Open classification_results.html in browser")
    print("  2. Interactive Plotly charts with zoom/pan")
    print("  3. Compare all methods at a glance")
    print()


if __name__ == '__main__':
    main()
