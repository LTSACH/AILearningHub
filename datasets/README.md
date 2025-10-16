# 📊 Public Datasets

Collection of datasets for AI/ML tutorials and demos. All datasets are free to use for educational purposes.

---

## 📚 Available Datasets

| Dataset | Size | Type | Categories | Description |
|---------|------|------|------------|-------------|
| [BBC News](bbcnews/) | 2,225 articles | Text Classification | 5 classes | News articles from BBC categorized by topic |

---

## 🚀 Quick Start

### Load Data Directly from GitHub

```python
import pandas as pd

# Load BBC News dataset
url = "https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/train.csv"
df = pd.read_csv(url)

print(f"Loaded {len(df)} samples")
print(df.head())
```

### Download to Local

```bash
# Download full dataset
wget https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/bbc-news.csv

# Or using curl
curl -O https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/bbc-news.csv
```

---

## 📖 Dataset Details

Each dataset folder contains:
- **data/** - Raw data files (CSV, JSON, etc.)
- **README.md** - Detailed description, statistics, and usage examples
- **metadata.json** - Machine-readable metadata

---

## 🔗 Usage in Tutorials

These datasets are used in our tutorials:

- **BBC News** → [Text Classification Tutorial](../02_Machine_Learning/)
- **Animals10** (coming soon) → Image Classification Tutorial

---

## 📝 Data Splits

Pre-split datasets are provided for reproducibility:
- **train.csv** - Training set (~70%)
- **val.csv** - Validation set (~15%)
- **test.csv** - Test set (~15%)

Use the same splits across experiments for fair comparison.

---

## ⚖️ License & Citation

All datasets in this repository are either:
- Public domain
- Licensed for educational use
- Properly attributed with citation

See individual dataset README files for specific license information.

---

## 🤝 Contributing

Want to add a dataset? Please ensure:
1. Data is legal to share
2. Appropriate license/attribution
3. Clean, well-documented
4. < 50MB for CSV/text files
5. Follow the structure guidelines

---

## 📞 Support

Questions about datasets? Open an issue or check individual dataset READMEs.

---

**Last Updated:** October 16, 2025

