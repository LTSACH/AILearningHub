# 💰 Adult Income Dataset

Predict whether income exceeds $50K/year based on census data.

## 📊 Quick Stats

- **Source:** [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets/adult)
- **Year:** 1994 US Census
- **Size:** 48,842 samples (32,561 train + 16,281 test)
- **Features:** 14 (6 numerical + 8 categorical)
- **Target:** Binary (<=50K, >50K)
- **Class Balance:** 75.9% <=50K, 24.1% >50K (imbalanced)

---

## 🚀 Quick Start

### Load Directly from GitHub

```python
import pandas as pd

# Training data
train_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/adult-income/data/adult_train.csv'
train = pd.read_csv(train_url)

# Test data
test_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/adult-income/data/adult_test.csv'
test = pd.read_csv(test_url)

print(f"✅ Loaded {len(train):,} training samples")
print(f"✅ Loaded {len(test):,} test samples")
```

### After Cloning Repository

```python
import pandas as pd

train = pd.read_csv('datasets/adult-income/data/adult_train.csv')
test = pd.read_csv('datasets/adult-income/data/adult_test.csv')
```

---

## 📋 Features

### Numerical Features (6)

| Feature | Type | Range | Description |
|---------|------|-------|-------------|
| age | int | 17-90 | Age in years |
| fnlwgt | int | 12k-1.5M | Census sampling weight |
| education_num | int | 1-16 | Education level (numeric) |
| capital_gain | int | 0-100k | Capital gains |
| capital_loss | int | 0-4.4k | Capital losses |
| hours_per_week | int | 1-99 | Work hours per week |

### Categorical Features (8)

| Feature | Categories | Missing | Example Values |
|---------|------------|---------|----------------|
| workclass | 8 | ✅ Yes | Private, Self-emp, Government |
| education | 16 | ❌ No | Bachelors, HS-grad, Masters |
| marital_status | 7 | ❌ No | Married-civ-spouse, Never-married |
| occupation | 14 | ✅ Yes | Tech-support, Sales, Craft-repair |
| relationship | 6 | ❌ No | Husband, Wife, Not-in-family |
| race | 5 | ❌ No | White, Black, Asian-Pac-Islander |
| sex | 2 | ❌ No | Male, Female |
| native_country | 41 | ✅ Yes | United-States, Mexico, India, etc. |

### Target Variable

**income:** Binary classification
- `<=50K` - 75.9% of samples
- `>50K` - 24.1% of samples

---

## 🔍 Missing Values

| Feature | Train Missing | Test Missing | Percent |
|---------|--------------|--------------|---------|
| workclass | 1,836 | 963 | ~5.6% |
| occupation | 1,843 | 966 | ~5.7% |
| native_country | 583 | 274 | ~1.7% |

**Encoding:** Missing values are represented as `NaN` (pandas null)

---

## 💡 Use Cases

### Exploratory Data Analysis (EDA)
- Missing value analysis and imputation strategies
- Distribution analysis (numerical and categorical)
- Correlation analysis
- Outlier detection
- Class imbalance visualization

### Machine Learning
- Binary classification
- Feature engineering (encoding, scaling)
- Handling imbalanced classes
- Model comparison and evaluation
- Hyperparameter tuning

### Ethics & Fairness
- Bias detection in predictions
- Fairness across demographic groups
- Responsible AI practices

---

## 📈 Benchmark Results

From the original paper (Kohavi, 1996):

| Algorithm | Error Rate | Accuracy |
|-----------|-----------|----------|
| C4.5 | 15.54% | 84.46% |
| C4.5-auto | 14.46% | 85.54% |
| Naive-Bayes | 16.12% | 83.88% |
| NBTree | 14.10% | 85.90% |

**Your goal:** Beat 85% accuracy!

---

## ⚠️ Important Notes

### Data Preprocessing

This dataset has been **preprocessed** for convenience:

✅ **What was done:**
1. Added column names (original data has none)
2. Replaced `?` with `NaN` for missing values  
3. Removed extra whitespace from strings
4. Standardized target labels (removed trailing `.` from test set)
5. Converted to clean CSV format

📥 **Want raw data?**  
Original format available at: https://archive.ics.uci.edu/ml/datasets/adult

### Ethical Considerations

⚠️ **This dataset contains sensitive attributes:**
- Sex (Male/Female)
- Race (5 categories)
- Native country (41 countries)

⚠️ **Historical bias:**
- Data from 1994 US Census
- Reflects societal conditions 30 years ago
- May not represent current demographics

⚠️ **Use responsibly:**
- Educational and research purposes only
- Consider fairness when building models
- Analyze bias across demographic groups
- Document limitations in your work

---

## 🎓 Learning Path

### Beginner
1. **Load & Explore:** Load data and check basic statistics
2. **Visualization:** Create plots for each feature
3. **Missing Values:** Analyze and handle missing data
4. **Baseline Model:** Train logistic regression

### Intermediate
1. **Feature Engineering:** Encode categoricals, scale numericals
2. **Handle Imbalance:** Try SMOTE, class weights
3. **Multiple Models:** Compare RF, XGBoost, etc.
4. **Cross-Validation:** Proper evaluation

### Advanced
1. **Fairness Analysis:** Check bias across groups
2. **Feature Importance:** SHAP values, permutation importance
3. **Hyperparameter Tuning:** Grid search, Bayesian optimization
4. **Ensemble Methods:** Stacking, blending

---

## 📚 Related Resources

### Tutorials
- [EDA Tutorial](../../01_Data_Analysis/01_EDA/) - Coming soon
- [Classification Guide](../../02_Machine_Learning/) - Coming soon

### Documentation
- `dataset_info.txt` - Detailed statistics
- `LICENSE.txt` - Full license and attribution

### External Links
- [UCI Dataset Page](https://archive.ics.uci.edu/ml/datasets/adult)
- [Original Paper](https://www.aaai.org/Papers/KDD/1996/KDD96-033.pdf)
- [Fairness in ML](https://fairmlbook.org/)

---

## 📝 Citation

If you use this dataset, please cite:

```bibtex
@misc{kohavi1996adult,
  author = {Kohavi, Ron and Becker, Barry},
  title = {Adult Income Dataset},
  year = {1996},
  publisher = {UCI Machine Learning Repository},
  url = {https://archive.ics.uci.edu/ml/datasets/adult}
}
```

---

## ⚖️ License

**Dataset:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
**Source:** UCI Machine Learning Repository

See [LICENSE.txt](./LICENSE.txt) for full details.

---

## 🔗 Quick Links

- **Project Repository:** https://github.com/LTSACH/AILearningHub
- **Dataset Info:** [dataset_info.txt](./data/dataset_info.txt)
- **UCI Source:** https://archive.ics.uci.edu/ml/datasets/adult
- **Issues:** https://github.com/LTSACH/AILearningHub/issues

---

**Last Updated:** January 2025  
**Status:** ✅ Ready to use

