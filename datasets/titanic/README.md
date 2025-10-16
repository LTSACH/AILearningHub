# 🚢 Titanic Dataset

The sinking of the Titanic is one of the most infamous shipwrecks in history. This dataset contains information about the passengers aboard the RMS Titanic, which sank on April 15, 1912, during its maiden voyage after striking an iceberg.

## 📊 Dataset Overview

This is one of the most popular datasets for learning machine learning, particularly for binary classification problems.

**Competition:** [Kaggle - Titanic: Machine Learning from Disaster](https://www.kaggle.com/c/titanic)

### Files

| File | Size | Rows | Description |
|------|------|------|-------------|
| `train.csv` | 60KB | 891 | Training set with survival labels |
| `test.csv` | 28KB | 418 | Test set without survival labels |
| `gender_submission.csv` | 3KB | 418 | Example submission format |

**Total Size:** ~91 KB (uncompressed)

---

## 🎯 Problem Statement

**Goal:** Predict whether a passenger survived the Titanic disaster based on their characteristics.

**Type:** Binary Classification  
**Target Variable:** `Survived` (0 = No, 1 = Yes)  
**Evaluation Metric:** Accuracy

---

## 📋 Data Dictionary

### Features

| Variable | Definition | Type | Values/Range |
|----------|------------|------|--------------|
| `PassengerId` | Unique identifier | int | 1-1309 |
| `Survived` | Survival | int | 0 (No), 1 (Yes) |
| `Pclass` | Ticket class | int | 1 (1st), 2 (2nd), 3 (3rd) |
| `Name` | Passenger name | string | - |
| `Sex` | Gender | string | male, female |
| `Age` | Age in years | float | 0.42-80 |
| `SibSp` | # of siblings/spouses aboard | int | 0-8 |
| `Parch` | # of parents/children aboard | int | 0-6 |
| `Ticket` | Ticket number | string | - |
| `Fare` | Passenger fare | float | 0-512 |
| `Cabin` | Cabin number | string | - |
| `Embarked` | Port of embarkation | string | C (Cherbourg), Q (Queenstown), S (Southampton) |

### Variable Notes

- **Pclass**: A proxy for socio-economic status (SES)
  - 1st = Upper class
  - 2nd = Middle class
  - 3rd = Lower class

- **Age**: Fractional if less than 1. If estimated, is it in the form of xx.5

- **SibSp**: The dataset defines family relations in this way:
  - Sibling = brother, sister, stepbrother, stepsister
  - Spouse = husband, wife (mistresses and fiancés were ignored)

- **Parch**: The dataset defines family relations in this way:
  - Parent = mother, father
  - Child = daughter, son, stepdaughter, stepson
  - Some children travelled only with a nanny, therefore parch=0 for them

---

## 🔍 Data Quality Issues

### Missing Values

| Feature | Missing Count | Percentage | Strategy |
|---------|--------------|------------|----------|
| `Age` | 177 | 19.9% | Median/Mean imputation or model-based |
| `Cabin` | 687 | 77.1% | Consider dropping or create 'cabin_known' flag |
| `Embarked` | 2 | 0.2% | Mode imputation |

### Known Issues

- **Cabin**: Extremely high missing rate (77%) - may not be useful
- **Age**: Missing pattern may not be random (MNAR)
- **Ticket**: Complex format, not standardized
- **Fare**: Has extreme outliers (>$500)

---

## 📈 Quick Start

### Load Data (Multiple Options)

#### Option 1: From GitHub (Recommended - No Setup)
```python
import pandas as pd

# Direct load from this repository
BASE_URL = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/titanic/data/'

train = pd.read_csv(BASE_URL + 'train.csv')
test = pd.read_csv(BASE_URL + 'test.csv')

print(f"✅ Loaded {len(train)} training samples")
print(f"✅ Loaded {len(test)} test samples")
```

#### Option 2: From Seaborn Library
```python
import seaborn as sns

# Built-in dataset
df = sns.load_dataset('titanic')
print(df.head())

# Note: This version might have slightly different preprocessing
```

#### Option 3: From Kaggle (Requires Setup)
```python
# First: pip install kaggle
# Then: Set up API credentials (~/.kaggle/kaggle.json)

from kaggle.api.kaggle_api_extended import KaggleApi

api = KaggleApi()
api.authenticate()
api.competition_download_files('titanic', path='./data')
```

#### Option 4: Local (After Cloning Repo)
```python
import pandas as pd

train = pd.read_csv('datasets/titanic/data/train.csv')
test = pd.read_csv('datasets/titanic/data/test.csv')
```

---

## 🎓 Learning Objectives

This dataset is excellent for learning:

### Data Analysis
- [x] Exploratory Data Analysis (EDA)
- [x] Missing value analysis and imputation
- [x] Outlier detection and handling
- [x] Feature distribution analysis
- [x] Correlation analysis

### Data Preprocessing
- [x] Handling categorical variables (encoding)
- [x] Feature scaling/normalization
- [x] Creating new features (feature engineering)
- [x] Dealing with imbalanced classes

### Machine Learning
- [x] Binary classification algorithms
- [x] Model evaluation (accuracy, precision, recall, F1)
- [x] Cross-validation techniques
- [x] Hyperparameter tuning
- [x] Feature importance analysis

---

## 💡 Feature Engineering Ideas

Common feature engineering approaches for this dataset:

```python
# 1. Title from Name
df['Title'] = df['Name'].str.extract(' ([A-Za-z]+)\.', expand=False)
# Produces: Mr, Mrs, Miss, Master, Dr, Rev, etc.

# 2. Family Size
df['FamilySize'] = df['SibSp'] + df['Parch'] + 1

# 3. Is Alone
df['IsAlone'] = (df['FamilySize'] == 1).astype(int)

# 4. Age Groups
df['AgeGroup'] = pd.cut(df['Age'], bins=[0, 12, 18, 35, 60, 100], 
                        labels=['Child', 'Teen', 'Adult', 'Middle', 'Senior'])

# 5. Fare Per Person
df['FarePerPerson'] = df['Fare'] / df['FamilySize']

# 6. Cabin Deck (if cabin is known)
df['Deck'] = df['Cabin'].str[0]

# 7. Has Cabin
df['HasCabin'] = df['Cabin'].notna().astype(int)
```

---

## 📊 Expected Results

### Baseline Accuracy
- **Gender-based model**: ~76% (females survived more)
- **Random guess**: ~50%

### Good Performance
- **Logistic Regression**: 78-80%
- **Random Forest**: 80-82%
- **Gradient Boosting**: 82-84%
- **Stacking Ensemble**: 83-85%

**Kaggle Leaderboard Top Score:** ~85% (highly engineered features)

---

## 🔗 Related Resources

### Tutorials
- [EDA Tutorial](../../01_Data_Analysis/01_EDA/titanic_tabular/) - Coming soon
- [Feature Engineering Guide](../../01_Data_Analysis/03_Feature_Engineering/) - Coming soon

### External Links
- [Kaggle Competition](https://www.kaggle.com/c/titanic)
- [Encyclopedia Titanica](https://www.encyclopedia-titanica.org/) - Historical data source
- [Seaborn Dataset](https://github.com/mwaskom/seaborn-data/blob/master/titanic.csv)

### Recommended Kernels (Kaggle)
- [Titanic Data Science Solutions](https://www.kaggle.com/startupsci/titanic-data-science-solutions)
- [A Journey through Titanic](https://www.kaggle.com/omarelgabry/a-journey-through-titanic)

---

## ⚖️ License & Attribution

**License:** [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)

**Source:** Kaggle - Titanic: Machine Learning from Disaster

**Citation:**
```
@misc{titanic_kaggle,
  title={Titanic: Machine Learning from Disaster},
  author={Kaggle},
  year={2012},
  url={https://www.kaggle.com/c/titanic}
}
```

**Attribution Requirement:**  
When using this dataset, please cite the Kaggle competition and link to the original source.

See [LICENSE.txt](./LICENSE.txt) for full license details.

---

## 📌 Notes

- This is the **original Kaggle competition data** without modifications
- Missing values are preserved as-is for educational purposes
- Test set does not include survival labels (as per competition rules)
- `gender_submission.csv` shows the expected submission format (all females survived, all males died)

---

## 🤝 Contributing

Found an issue or have suggestions for improving this dataset documentation?

- Report issues on GitHub
- Submit pull requests for documentation improvements
- Share your analysis or visualization

---

## 📅 Version History

- **v1.0** (January 2025): Initial release
  - Added original Kaggle competition data
  - Created comprehensive documentation
  - Proper license attribution

---

**Historical Note:** On April 15, 1912, the Titanic sank after hitting an iceberg, resulting in the deaths of 1502 out of 2224 passengers and crew. This dataset allows us to analyze what factors made people more likely to survive.

*"Women and children first"* - This dataset confirms this maritime tradition was largely followed during the Titanic disaster.

---

*Last updated: January 2025*  
*Repository: [AI Learning Hub](https://github.com/LTSACH/AILearningHub)*

