"""Oxford Pets Mask Overview - Matplotlib
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/mask_statistics.csv
"""
import pandas as pd
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'mask_statistics.csv')

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
df['species'].value_counts().plot(kind='bar', ax=axes[0], color=['#3b82f6', '#f59e0b'])
axes[0].set_title('Masks by Species')
df['split'].value_counts().plot(kind='pie', ax=axes[1], autopct='%1.1f%%')
axes[1].set_title('Train/Val Split')
plt.tight_layout()
plt.show()
print(f"Total: {len(df):,} masks")
