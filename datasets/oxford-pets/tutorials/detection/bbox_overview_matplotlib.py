"""
Oxford Pets Bounding Box Overview - Matplotlib Version

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv
"""

import pandas as pd
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
df = pd.read_csv(base_url + 'bbox_statistics.csv')

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.suptitle('Detection Overview', fontsize=14, fontweight='bold')

# Species distribution
species_counts = df['species'].value_counts()
axes[0].bar(species_counts.index, species_counts.values, color=['#3b82f6', '#f59e0b'])
axes[0].set_title('Bboxes by Species')
axes[0].set_ylabel('Count')
for i, v in enumerate(species_counts.values):
    axes[0].text(i, v, str(v), ha='center', va='bottom')

# Split distribution
split_counts = df['split'].value_counts()
axes[1].pie(split_counts.values, labels=split_counts.index, autopct='%1.1f%%',
            colors=['#10b981', '#3b82f6'], startangle=90)
axes[1].set_title('Train/Val Split')

plt.tight_layout()
plt.show()

print(f"Total bboxes: {len(df):,}")
print(f"Breeds: {df['breed'].nunique()}")

