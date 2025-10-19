"""Oxford Pets Mask Overview - Seaborn
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/mask_statistics.csv
"""
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'mask_statistics.csv')

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
sns.countplot(data=df, x='species', ax=axes[0])
df['split'].value_counts().plot(kind='pie', ax=axes[1], autopct='%1.1f%%')
plt.tight_layout()
plt.show()
print(f"Total: {len(df):,} masks")
