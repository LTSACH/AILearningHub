"""
BBC News Classification using Multinomial Naive Bayes
====================================================

This script demonstrates text classification using Multinomial Naive Bayes
on the BBC News dataset with TF-IDF vectorization.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.offline as pyo

def load_bbc_data():
    """Load and prepare BBC News dataset from GitHub Pages"""
    print("Loading BBC News dataset from GitHub Pages...")
    
    # URLs for the dataset files
    train_url = "https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/train.csv"
    val_url = "https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/val.csv"
    test_url = "https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/test.csv"
    
    try:
        # Load data from GitHub Pages
        print("Loading training data...")
        train_df = pd.read_csv(train_url)
        
        print("Loading validation data...")
        val_df = pd.read_csv(val_url)
        
        print("Loading test data...")
        test_df = pd.read_csv(test_url)
        
        # Combine all data for training
        df = pd.concat([train_df, val_df, test_df], ignore_index=True)
        
        print(f"Dataset shape: {df.shape}")
        print(f"Categories: {df['category'].value_counts().to_dict()}")
        
        return df, train_df, val_df, test_df
        
    except Exception as e:
        print(f"Error loading data from GitHub Pages: {e}")
        print("Falling back to local files...")
        
        # Fallback to local files if GitHub Pages fails
        try:
            train_df = pd.read_csv("../../datasets/bbcnews/data/train.csv")
            val_df = pd.read_csv("../../datasets/bbcnews/data/val.csv")
            test_df = pd.read_csv("../../datasets/bbcnews/data/test.csv")
            
            df = pd.concat([train_df, val_df, test_df], ignore_index=True)
            
            print(f"Dataset shape: {df.shape}")
            print(f"Categories: {df['category'].value_counts().to_dict()}")
            
            return df, train_df, val_df, test_df
            
        except Exception as local_e:
            print(f"Error loading local files: {local_e}")
            raise Exception("Could not load BBC News dataset from any source")

def preprocess_text(texts):
    """Preprocess text data"""
    print("Preprocessing text data...")
    
    # Basic preprocessing (in practice, add more steps)
    processed_texts = []
    for text in texts:
        # Convert to lowercase
        text = text.lower()
        # Remove extra whitespace
        text = ' '.join(text.split())
        processed_texts.append(text)
    
    return processed_texts

def vectorize_text(texts, max_features=10000):
    """Convert text to TF-IDF vectors"""
    print(f"Vectorizing text with max_features={max_features}...")
    
    # Initialize TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=max_features,
        stop_words='english',
        ngram_range=(1, 2),  # Use unigrams and bigrams
        min_df=2,  # Ignore terms that appear in less than 2 documents
        max_df=0.95  # Ignore terms that appear in more than 95% of documents
    )
    
    # Fit and transform the text data
    tfidf_matrix = vectorizer.fit_transform(texts)
    
    print(f"TF-IDF matrix shape: {tfidf_matrix.shape}")
    print(f"Vocabulary size: {len(vectorizer.vocabulary_)}")
    
    return tfidf_matrix, vectorizer

def train_model(X_train, y_train):
    """Train Multinomial Naive Bayes model"""
    print("Training Multinomial Naive Bayes model...")
    
    # Initialize Multinomial NB
    model = MultinomialNB(alpha=1.0)  # Laplace smoothing
    
    # Train the model
    model.fit(X_train, y_train)
    
    print("Model training completed!")
    return model

def evaluate_model(model, X_test, y_test, categories):
    """Evaluate model performance with Plotly visualizations"""
    print("Evaluating model performance...")
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.4f}")
    
    # Classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=categories))
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(cm)
    
    # Create Plotly visualizations
    create_confusion_matrix_plot(cm, categories)
    create_classification_report_html(y_test, y_pred, categories, accuracy)
    
    return y_pred, accuracy

def create_confusion_matrix_plot(cm, categories):
    """Create and save confusion matrix plot using Plotly"""
    print("Creating confusion matrix visualization...")
    
    # Create heatmap
    fig = go.Figure(data=go.Heatmap(
        z=cm,
        x=categories,
        y=categories,
        colorscale='Viridis',
        text=cm,
        texttemplate="%{text}",
        textfont={"size": 16},
        hoverongaps=False
    ))
    
    fig.update_layout(
        title={
            'text': 'BBC News Classification - Confusion Matrix',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 20}
        },
        xaxis_title='Predicted Category',
        yaxis_title='True Category',
        width=600,
        height=500,
        font=dict(size=14)
    )
    
    # Save as HTML (PNG export has compatibility issues)
    fig.write_html("bbc_confusion_matrix.html")
    print("Confusion matrix saved as 'bbc_confusion_matrix.html'")
    
    # Try to save as PNG, but don't fail if it doesn't work
    try:
        fig.write_image("bbc_confusion_matrix.png", width=600, height=500, scale=2)
        print("Confusion matrix saved as 'bbc_confusion_matrix.png'")
    except Exception as e:
        print(f"Could not save PNG (this is OK): {e}")
        print("HTML version is available for viewing")

def create_classification_report_html(y_test, y_pred, categories, accuracy):
    """Create comprehensive HTML report with Plotly visualizations"""
    print("Creating classification report...")
    
    from sklearn.metrics import precision_recall_fscore_support
    
    # Get precision, recall, f1-score for each class
    precision, recall, f1, support = precision_recall_fscore_support(y_test, y_pred, average=None)
    
    # Create metrics dataframe
    metrics_df = pd.DataFrame({
        'Category': categories,
        'Precision': precision,
        'Recall': recall,
        'F1-Score': f1,
        'Support': support
    })
    
    # Create subplots
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('Precision by Category', 'Recall by Category', 
                       'F1-Score by Category', 'Support by Category'),
        specs=[[{"type": "bar"}, {"type": "bar"}],
               [{"type": "bar"}, {"type": "bar"}]]
    )
    
    # Add precision bar chart
    fig.add_trace(
        go.Bar(x=metrics_df['Category'], y=metrics_df['Precision'], 
               name='Precision', marker_color='#1f77b4'),
        row=1, col=1
    )
    
    # Add recall bar chart
    fig.add_trace(
        go.Bar(x=metrics_df['Category'], y=metrics_df['Recall'], 
               name='Recall', marker_color='#ff7f0e'),
        row=1, col=2
    )
    
    # Add F1-score bar chart
    fig.add_trace(
        go.Bar(x=metrics_df['Category'], y=metrics_df['F1-Score'], 
               name='F1-Score', marker_color='#2ca02c'),
        row=2, col=1
    )
    
    # Add support bar chart
    fig.add_trace(
        go.Bar(x=metrics_df['Category'], y=metrics_df['Support'], 
               name='Support', marker_color='#d62728'),
        row=2, col=2
    )
    
    fig.update_layout(
        title={
            'text': f'BBC News Classification Report - Overall Accuracy: {accuracy:.4f}',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 20}
        },
        height=800,
        showlegend=False,
        font=dict(size=12)
    )
    
    # Update x-axis labels
    for i in range(1, 3):
        for j in range(1, 3):
            fig.update_xaxes(tickangle=45, row=i, col=j)
    
    # Save as HTML
    fig.write_html("bbc_classification_report.html")
    print("Classification report saved as 'bbc_classification_report.html'")
    
    # Create detailed metrics table
    create_metrics_table_html(metrics_df, accuracy)

def create_metrics_table_html(metrics_df, accuracy):
    """Create detailed metrics table HTML"""
    print("Creating detailed metrics table...")
    
    # Round metrics to 4 decimal places
    metrics_df_rounded = metrics_df.round(4)
    
    # Create HTML table
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>BBC News Classification - Detailed Metrics</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            h1 {{ color: #2c3e50; text-align: center; }}
            h2 {{ color: #34495e; }}
            table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 12px; text-align: center; }}
            th {{ background-color: #3498db; color: white; }}
            tr:nth-child(even) {{ background-color: #f2f2f2; }}
            .accuracy {{ font-size: 24px; color: #27ae60; font-weight: bold; }}
            .summary {{ background-color: #ecf0f1; padding: 20px; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <h1>🍄 BBC News Classification Results</h1>
        
        <div class="summary">
            <h2>Summary</h2>
            <p class="accuracy">Overall Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)</p>
            <p><strong>Dataset:</strong> BBC News Articles</p>
            <p><strong>Algorithm:</strong> Multinomial Naive Bayes</p>
            <p><strong>Vectorization:</strong> TF-IDF</p>
        </div>
        
        <h2>Detailed Metrics by Category</h2>
        {metrics_df_rounded.to_html(index=False, classes='metrics-table')}
        
        <h2>Interpretation</h2>
        <ul>
            <li><strong>Precision:</strong> Of all articles predicted as a category, how many were actually that category?</li>
            <li><strong>Recall:</strong> Of all articles in a category, how many were correctly identified?</li>
            <li><strong>F1-Score:</strong> Harmonic mean of precision and recall (balanced metric)</li>
            <li><strong>Support:</strong> Number of actual occurrences of each category in the test set</li>
        </ul>
    </body>
    </html>
    """
    
    with open("bbc_detailed_metrics.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print("Detailed metrics table saved as 'bbc_detailed_metrics.html'")

def get_feature_importance(model, vectorizer, top_n=20):
    """Get top features for each class"""
    print(f"Extracting top {top_n} features per class...")
    
    feature_names = vectorizer.get_feature_names_out()
    classes = model.classes_
    
    feature_importance = {}
    
    for i, class_name in enumerate(classes):
        # Get log probabilities for this class
        log_probs = model.feature_log_prob_[i]
        
        # Get top features
        top_indices = np.argsort(log_probs)[-top_n:][::-1]
        top_features = [(feature_names[idx], log_probs[idx]) for idx in top_indices]
        
        feature_importance[class_name] = top_features
        print(f"\nTop {top_n} features for '{class_name}':")
        for feature, score in top_features:
            print(f"  {feature}: {score:.4f}")
    
    return feature_importance

def predict_new_text(model, vectorizer, new_text):
    """Predict category for new text"""
    print(f"Predicting category for: '{new_text}'")
    
    # Preprocess
    processed_text = preprocess_text([new_text])[0]
    
    # Vectorize
    text_vector = vectorizer.transform([processed_text])
    
    # Predict
    prediction = model.predict(text_vector)[0]
    probabilities = model.predict_proba(text_vector)[0]
    
    print(f"Predicted category: {prediction}")
    print("Class probabilities:")
    for i, class_name in enumerate(model.classes_):
        print(f"  {class_name}: {probabilities[i]:.4f}")
    
    return prediction, probabilities

def main():
    """Main execution function"""
    print("=" * 60)
    print("BBC News Classification with Multinomial Naive Bayes")
    print("=" * 60)
    
    # 1. Load data
    df, train_df, val_df, test_df = load_bbc_data()
    
    # 2. Preprocess text
    processed_texts = preprocess_text(df['text'])
    
    # 3. Vectorize text
    X, vectorizer = vectorize_text(processed_texts, max_features=10000)
    y = df['category'].values
    
    # 4. Use proper train/test split (use val_df as test set)
    print("Using validation set as test set...")
    val_processed = preprocess_text(val_df['text'])
    X_test = vectorizer.transform(val_processed)
    y_test = val_df['category'].values
    
    # Use train_df for training
    train_processed = preprocess_text(train_df['text'])
    X_train = vectorizer.transform(train_processed)
    y_train = train_df['category'].values
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # 5. Train model
    model = train_model(X_train, y_train)
    
    # 6. Evaluate model with visualizations
    y_pred, accuracy = evaluate_model(model, X_test, y_test, model.classes_)
    
    # 7. Feature importance
    feature_importance = get_feature_importance(model, vectorizer, top_n=15)
    
    # 8. Example predictions
    print("\n" + "=" * 40)
    print("Example Predictions")
    print("=" * 40)
    
    example_texts = [
        "Stock market reaches new all-time high",
        "New action movie breaks box office records", 
        "Election results show significant changes",
        "Football team wins the championship",
        "Artificial intelligence advances in healthcare"
    ]
    
    for text in example_texts:
        predict_new_text(model, vectorizer, text)
        print()
    
    print("\n" + "=" * 60)
    print("Generated Files:")
    print("=" * 60)
    print("📊 bbc_confusion_matrix.png - Confusion matrix visualization")
    print("📊 bbc_confusion_matrix.html - Interactive confusion matrix")
    print("📈 bbc_classification_report.html - Classification metrics report")
    print("📋 bbc_detailed_metrics.html - Detailed metrics table")
    print("=" * 60)
    print("Analysis completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
