"""
Oxford Pets Bounding Box Overview - Seaborn Version

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("whitegrid")

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
df = pd.read_csv(base_url + 'bbox_statistics.csv')

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.suptitle('Detection Overview', fontsize=14, fontweight='bold')

# Species count plot
sns.countplot(data=df, x='species', ax=axes[0], palette='Set2')
axes[0].set_title('Bboxes by Species')
axes[0].set_ylabel('Count')

# Breed distribution (top 15)
top_breeds = df['breed'].value_counts().head(15)
sns.barplot(x=top_breeds.values, y=top_breeds.index, ax=axes[1], palette='viridis')
axes[1].set_title('Top 15 Breeds')
axes[1].set_xlabel('Count')

plt.tight_layout()
plt.show()

print(f"Total: {len(df):,} bboxes, {df['breed'].nunique()} breeds")

