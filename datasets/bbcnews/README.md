# 📰 BBC News Classification Dataset

Text classification dataset containing news articles from BBC News, categorized by topic.

---

## 📊 Dataset Overview

| Property | Value |
|----------|-------|
| **Name** | BBC News Classification |
| **Type** | Text Classification |
| **Size** | 2,225 articles |
| **Categories** | 5 (business, entertainment, politics, sport, tech) |
| **Format** | CSV |
| **Language** | English |
| **License** | Public Domain (Educational Use) |

---

## 📁 Files

```
bbcnews/
├── data/
│   ├── bbc-news.csv    # Full dataset (2,225 articles)
│   ├── train.csv       # Training set (1,558 articles, 70%)
│   ├── test.csv        # Test set (335 articles, 15%)
│   └── val.csv         # Validation set (335 articles, 15%)
├── README.md           # This file
└── metadata.json       # Machine-readable metadata
```

---

## 📈 Statistics

### Dataset Size
- **Total**: 2,225 articles
- **Training**: 1,558 articles (70%)
- **Validation**: 335 articles (15%)
- **Test**: 335 articles (15%)

### Categories Distribution
| Category | Count | Percentage |
|----------|-------|------------|
| Business | ~510 | 22.9% |
| Entertainment | ~386 | 17.3% |
| Politics | ~417 | 18.7% |
| Sport | ~511 | 23.0% |
| Tech | ~401 | 18.0% |

### Text Statistics
- **Average article length**: ~380 words
- **Vocabulary size**: ~29,000 unique words
- **Balanced classes**: Relatively balanced distribution

---

## 🚀 Usage Examples

### Load Full Dataset

```python
import pandas as pd

# Load from GitHub (no download needed)
url = "https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/bbc-news.csv"
df = pd.read_csv(url)

print(f"Dataset shape: {df.shape}")
print(df['label'].value_counts())
```

### Load Pre-split Data

```python
import pandas as pd

base_url = "https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/"

# Load training data
train_df = pd.read_csv(base_url + "train.csv")
print(f"Training samples: {len(train_df)}")

# Load validation data
val_df = pd.read_csv(base_url + "val.csv")
print(f"Validation samples: {len(val_df)}")

# Load test data
test_df = pd.read_csv(base_url + "test.csv")
print(f"Test samples: {len(test_df)}")
```

### Basic Text Classification Example

```python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report

# Load data
base_url = "https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/"
train_df = pd.read_csv(base_url + "train.csv")
test_df = pd.read_csv(base_url + "test.csv")

# Prepare features
vectorizer = TfidfVectorizer(max_features=5000)
X_train = vectorizer.fit_transform(train_df['text'])
X_test = vectorizer.transform(test_df['text'])

y_train = train_df['label']
y_test = test_df['label']

# Train classifier
clf = MultinomialNB()
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))
```

---

## 📥 Download Options

### Option 1: Direct Load in Python (Recommended)
```python
import pandas as pd
url = "https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/train.csv"
df = pd.read_csv(url)
```

### Option 2: Download via wget
```bash
wget https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/bbc-news.csv
```

### Option 3: Download via curl
```bash
curl -O https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/bbc-news.csv
```

### Option 4: Download via Git Clone
```bash
git clone https://github.com/LTSACH/AILearningHub.git
cd AILearningHub/datasets/bbcnews/data/
```

---

## 🔍 Data Format

### CSV Structure
```
text,label
"Article text here...",business
"Another article...",sport
```

### Columns
- **text** (string): Full article text
- **label** (string): Category (business, entertainment, politics, sport, tech)

### Example Row
```csv
"UK economy facing 'major risks'...",business
```

---

## 🎯 Typical Tasks

This dataset is suitable for:
- **Text Classification** - Categorize news by topic
- **Feature Extraction** - TF-IDF, Word2Vec, BERT embeddings
- **Model Comparison** - Naive Bayes, SVM, Neural Networks
- **Transfer Learning** - Fine-tune BERT, RoBERTa
- **Multi-class Classification** - 5-way classification problem

---

## 📊 Benchmarks

Typical accuracy on test set:
- **Naive Bayes + TF-IDF**: ~96-97%
- **SVM + TF-IDF**: ~97-98%
- **BERT (fine-tuned)**: ~98-99%

---

## ⚖️ License & Citation

### License
This dataset is available for educational and research purposes.

### Citation
```
@misc{bbcnews2025,
  title={BBC News Classification Dataset},
  author={AI Learning Hub},
  year={2025},
  url={https://github.com/LTSACH/AILearningHub/tree/main/datasets/bbcnews}
}
```

### Source
Original data from BBC News articles, preprocessed for educational purposes.

---

## 🤝 Contributing

Found an issue with the data? Please open an issue on GitHub.

---

## 📚 Related Resources

- [Text Classification Tutorial](../../02_Machine_Learning/)
- [Dataset Catalog](../README.md)
- [AILearningHub Homepage](../../)

---

**Last Updated:** October 16, 2025

