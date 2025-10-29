import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import plotly.graph_objects as go
import plotly.express as px
import os
import urllib.request

def load_bbc_data():
    """Load BBC News dataset from GitHub Pages with local fallback."""
    print("📰 Loading BBC News dataset...")
    
    # GitHub Pages URLs
    train_url = "https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/train.csv"
    val_url = "https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/val.csv"
    test_url = "https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/test.csv"
    
    # Local fallback files
    local_files = {
        'train': 'data/train.csv',
        'val': 'data/val.csv', 
        'test': 'data/test.csv'
    }
    
    try:
        # Try to load from GitHub Pages first
        print("Loading from GitHub Pages...")
        train_df = pd.read_csv(train_url)
        val_df = pd.read_csv(val_url)
        test_df = pd.read_csv(test_url)
        print("✅ Successfully loaded from GitHub Pages")
        
    except Exception as e:
        print(f"❌ Failed to load from GitHub Pages: {e}")
        print("Trying local files...")
        
        # Try local files
        try:
            train_df = pd.read_csv(local_files['train'])
            val_df = pd.read_csv(local_files['val'])
            test_df = pd.read_csv(local_files['test'])
            print("✅ Successfully loaded from local files")
        except Exception as e2:
            print(f"❌ Failed to load local files: {e2}")
            print("Creating sample data...")
            
            # Create sample data as last resort
            train_df, val_df, test_df = create_sample_data()
    
    print(f"Training samples: {len(train_df)}")
    print(f"Validation samples: {len(val_df)}")
    print(f"Test samples: {len(test_df)}")
    print(f"Categories: {train_df['category'].unique()}")
    
    return train_df, val_df, test_df

def create_sample_data():
    """Create sample BBC News data for demonstration."""
    print("Creating sample BBC News data...")
    
    sample_data = {
        'text': [
            "The economy is growing steadily with new business investments",
            "The government announced new policies for economic development",
            "Sports team won the championship with outstanding performance",
            "New technology breakthrough in artificial intelligence research",
            "Entertainment industry celebrates award ceremony success",
            "Political leaders discuss international cooperation agreements",
            "Business sector reports record profits this quarter",
            "Sports fans celebrate their team's victory in finals",
            "Tech companies launch innovative products this year",
            "Entertainment stars attend glamorous red carpet event"
        ],
        'category': [
            'business', 'politics', 'sport', 'tech', 'entertainment',
            'politics', 'business', 'sport', 'tech', 'entertainment'
        ]
    }
    
    df = pd.DataFrame(sample_data)
    
    # Split into train/val/test
    train_df = df.iloc[:6].copy()
    val_df = df.iloc[6:8].copy()
    test_df = df.iloc[8:].copy()
    
    return train_df, val_df, test_df

def preprocess_text(text):
    """Basic text preprocessing."""
    if pd.isna(text):
        return ""
    
    # Convert to lowercase and remove extra whitespace
    text = str(text).lower().strip()
    
    # Remove special characters (keep basic punctuation)
    import re
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text

def vectorize_text(train_texts, val_texts, test_texts, max_features=10000):
    """Vectorize text using TF-IDF."""
    print("Vectorizing text data...")
    
    # Preprocess texts
    train_processed = [preprocess_text(text) for text in train_texts]
    val_processed = [preprocess_text(text) for text in val_texts]
    test_processed = [preprocess_text(text) for text in test_texts]
    
    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=max_features,
        stop_words='english',
        ngram_range=(1, 2),  # Use unigrams and bigrams
        min_df=2,  # Ignore terms that appear in less than 2 documents
        max_df=0.95  # Ignore terms that appear in more than 95% of documents
    )
    
    # Fit on training data
    X_train = vectorizer.fit_transform(train_processed)
    X_val = vectorizer.transform(val_processed)
    X_test = vectorizer.transform(test_processed)
    
    print(f"Vocabulary size: {len(vectorizer.vocabulary_)}")
    print(f"Training matrix shape: {X_train.shape}")
    print(f"Validation matrix shape: {X_val.shape}")
    print(f"Test matrix shape: {X_test.shape}")
    
    return X_train, X_val, X_test, vectorizer

def train_model(X_train, y_train):
    """Train Softmax Regression model (LogisticRegression with multinomial)."""
    print("Training Softmax Regression model...")
    
    # Use LogisticRegression with multinomial for softmax regression
    model = LogisticRegression(
        multi_class='multinomial',
        solver='lbfgs',  # Good for small datasets
        max_iter=1000,
        random_state=42,
        C=1.0  # Regularization parameter
    )
    
    model.fit(X_train, y_train)
    print("✅ Model training completed")
    
    return model

def evaluate_model(model, X_test, y_test, target_names, output_dir="output"):
    """Evaluate model and generate reports/plots."""
    print("Evaluating model performance...")
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {accuracy:.4f}")
    
    # Classification Report
    report = classification_report(y_test, y_pred, target_names=target_names)
    print("\nClassification Report:")
    print(report)
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(cm)
    
    # Create output directory
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Plot Confusion Matrix with Plotly
    fig_cm = px.imshow(
        cm,
        labels=dict(x="Predicted", y="True", color="Count"),
        x=target_names,
        y=target_names,
        color_continuous_scale="Viridis",
        title="Confusion Matrix - BBC News Classification"
    )
    
    # Update layout
    fig_cm.update_layout(
        width=600,
        height=500,
        font=dict(size=12)
    )
    
    # Save confusion matrix (skip if kaleido not available)
    try:
        cm_path = os.path.join(output_dir, "bbc_confusion_matrix.png")
        fig_cm.write_image(cm_path)
        print(f"Confusion matrix saved to {cm_path}")
    except Exception as e:
        print(f"⚠️ Could not save confusion matrix image: {e}")
        print("Continuing without image export...")
    
    # Generate HTML report
    html_report = generate_html_report(accuracy, report, cm, target_names)
    report_path = os.path.join(output_dir, "bbc_classification_report.html")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(html_report)
    print(f"HTML report saved to {report_path}")
    
    return accuracy, report, cm

def generate_html_report(accuracy, report, cm, target_names):
    """Generate HTML report for classification results."""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>BBC News Classification Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .header {{ background: #667eea; color: white; padding: 20px; border-radius: 8px; }}
            .section {{ margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }}
            .accuracy {{ font-size: 24px; font-weight: bold; color: #28a745; }}
            pre {{ background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }}
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: center; }}
            th {{ background: #f8f9fa; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📰 BBC News Classification Report</h1>
            <p>Softmax Regression Model Performance Analysis</p>
        </div>
        
        <div class="section">
            <h2>Overall Performance</h2>
            <div class="accuracy">Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)</div>
        </div>
        
        <div class="section">
            <h2>Classification Report</h2>
            <pre>{report}</pre>
        </div>
        
        <div class="section">
            <h2>Confusion Matrix</h2>
            <table>
                <tr>
                    <th></th>
                    {''.join([f'<th>{name}</th>' for name in target_names])}
                </tr>
                {''.join([f'<tr><th>{target_names[i]}</th>' + ''.join([f'<td>{cm[i][j]}</td>' for j in range(len(target_names))]) + '</tr>' for i in range(len(target_names))])}
            </table>
        </div>
        
        <div class="section">
            <h2>Model Information</h2>
            <ul>
                <li><strong>Algorithm:</strong> Softmax Regression (LogisticRegression with multinomial)</li>
                <li><strong>Vectorization:</strong> TF-IDF with unigrams and bigrams</li>
                <li><strong>Max Features:</strong> 10,000</li>
                <li><strong>Regularization:</strong> L2 (C=1.0)</li>
            </ul>
        </div>
    </body>
    </html>
    """
    return html_content

def get_feature_importance(model, vectorizer, top_n=20):
    """Get top features for each class."""
    print(f"Extracting top {top_n} features for each class...")
    
    feature_names = vectorizer.get_feature_names_out()
    classes = model.classes_
    
    feature_importance = {}
    
    for i, class_name in enumerate(classes):
        # Get coefficients for this class
        coef = model.coef_[i]
        
        # Get top features (most negative coefficients for multinomial)
        top_indices = coef.argsort()[:top_n]
        top_features = [(feature_names[idx], coef[idx]) for idx in top_indices]
        
        feature_importance[class_name] = top_features
        print(f"\nTop {top_n} features for '{class_name}':")
        for word, score in top_features:
            print(f"  {word}: {score:.4f}")
    
    return feature_importance

def predict_new_text(model, vectorizer, text, target_names):
    """Predict category for new text."""
    print(f"\nPredicting category for: '{text}'")
    
    # Preprocess and vectorize
    processed_text = preprocess_text(text)
    X_new = vectorizer.transform([processed_text])
    
    # Get prediction and probabilities
    prediction = model.predict(X_new)[0]
    probabilities = model.predict_proba(X_new)[0]
    
    # Get predicted class name
    if isinstance(prediction, str):
        predicted_class = prediction
    else:
        predicted_class = target_names[prediction]
    
    print(f"Predicted category: {predicted_class}")
    print("Probability distribution:")
    for i, prob in enumerate(probabilities):
        print(f"  {target_names[i]}: {prob:.4f}")
    
    return predicted_class, probabilities

def main():
    """Main function to run the complete pipeline."""
    print("🚀 Starting BBC News Classification with Softmax Regression")
    print("=" * 60)
    
    # Load data
    train_df, val_df, test_df = load_bbc_data()
    
    # Prepare data
    X_train, X_val, X_test, vectorizer = vectorize_text(
        train_df['text'], val_df['text'], test_df['text']
    )
    
    y_train = train_df['category'].values
    y_val = val_df['category'].values
    y_test = test_df['category'].values
    
    # Get unique target names
    target_names = sorted(np.unique(y_train))
    
    # Train model
    model = train_model(X_train, y_train)
    
    # Evaluate on validation set
    print("\n" + "="*50)
    print("VALIDATION SET EVALUATION")
    print("="*50)
    val_accuracy, val_report, val_cm = evaluate_model(
        model, X_val, y_val, target_names, "output/validation"
    )
    
    # Evaluate on test set
    print("\n" + "="*50)
    print("TEST SET EVALUATION")
    print("="*50)
    test_accuracy, test_report, test_cm = evaluate_model(
        model, X_test, y_test, target_names, "output/test"
    )
    
    # Feature importance
    print("\n" + "="*50)
    print("FEATURE IMPORTANCE ANALYSIS")
    print("="*50)
    feature_importance = get_feature_importance(model, vectorizer, top_n=15)
    
    # Example predictions
    print("\n" + "="*50)
    print("EXAMPLE PREDICTIONS")
    print("="*50)
    
    example_texts = [
        "The stock market reached new highs today with strong economic indicators",
        "The football team won the championship in an exciting final match",
        "New smartphone technology revolutionizes mobile computing industry",
        "Government announces new healthcare policies for citizens",
        "Movie stars attend glamorous award ceremony in Hollywood"
    ]
    
    for text in example_texts:
        predict_new_text(model, vectorizer, text, target_names)
    
    print("\n" + "="*60)
    print("✅ BBC News Classification Pipeline Completed Successfully!")
    print(f"Final Test Accuracy: {test_accuracy:.4f}")
    print("="*60)

if __name__ == "__main__":
    main()
