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
import matplotlib.pyplot as plt
import seaborn as sns

def load_bbc_data():
    """Load and prepare BBC News dataset"""
    print("Loading BBC News dataset...")
    
    # Simulate BBC News data structure
    # In practice, you would load from actual files
    categories = ['business', 'entertainment', 'politics', 'sport', 'tech']
    
    # Sample data (in real scenario, load from files)
    sample_texts = [
        "The company reported strong quarterly earnings and market growth",
        "New movie releases this weekend at local theaters",
        "Government announces new policy changes for healthcare",
        "Team wins championship with outstanding performance",
        "New smartphone technology revolutionizes mobile industry"
    ] * 50  # Simulate more data
    
    sample_labels = ['business', 'entertainment', 'politics', 'sport', 'tech'] * 50
    
    # Create DataFrame
    df = pd.DataFrame({
        'text': sample_texts,
        'category': sample_labels
    })
    
    print(f"Dataset shape: {df.shape}")
    print(f"Categories: {df['category'].value_counts().to_dict()}")
    
    return df

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
    """Evaluate model performance"""
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
    
    return y_pred, accuracy

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
    df = load_bbc_data()
    
    # 2. Preprocess text
    processed_texts = preprocess_text(df['text'])
    
    # 3. Vectorize text
    X, vectorizer = vectorize_text(processed_texts, max_features=10000)
    y = df['category'].values
    
    # 4. Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # 5. Train model
    model = train_model(X_train, y_train)
    
    # 6. Evaluate model
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
    
    print("=" * 60)
    print("Analysis completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
