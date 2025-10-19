"""
Oxford Pets Bounding Box Properties - Seaborn Version

Tutorial: Bbox Properties Analysis
Library: Seaborn
Author: AILearningHub
Dataset: Oxford-IIIT Pets

Requirements:
    pip install pandas seaborn matplotlib numpy

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_style("whitegrid")
sns.set_palette("husl")

# Load data
print("📏 Loading Bounding Box Properties...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
df = pd.read_csv(base_url + 'bbox_statistics.csv')
print(f"✓ Loaded {len(df):,} bounding boxes")

# Create figure
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Bounding Box Properties - Seaborn', fontsize=16, fontweight='bold')

# 1. Width vs Height by Species
sns.scatterplot(data=df, x='width', y='height', hue='species', 
                alpha=0.5, ax=axes[0, 0])
axes[0, 0].set_title('Width vs Height by Species')
axes[0, 0].set_xlabel('Width (px)')
axes[0, 0].set_ylabel('Height (px)')

# 2. Aspect Ratio Distribution by Species
sns.histplot(data=df, x='aspect_ratio', hue='species', kde=True, 
             bins=40, ax=axes[0, 1], alpha=0.6)
axes[0, 1].set_title('Aspect Ratio Distribution')
axes[0, 1].set_xlabel('Aspect Ratio (W/H)')
axes[0, 1].axvline(1.0, color='red', linestyle='--', alpha=0.5, label='Square')
axes[0, 1].legend()

# 3. Size Category by Split
size_split = pd.crosstab(df['size_category'], df['split'], normalize='columns')
size_split.plot(kind='bar', stacked=True, ax=axes[1, 0], 
                color=['#3b82f6', '#10b981'])
axes[1, 0].set_title('Size Categories by Split')
axes[1, 0].set_xlabel('Size Category')
axes[1, 0].set_ylabel('Proportion')
axes[1, 0].set_xticklabels(axes[1, 0].get_xticklabels(), rotation=0)
axes[1, 0].legend(title='Split')

# 4. Normalized Area Box Plot by Species
sns.boxplot(data=df, x='species', y='normalized_area', ax=axes[1, 1])
axes[1, 1].set_title('Image Coverage by Species')
axes[1, 1].set_xlabel('Species')
axes[1, 1].set_ylabel('Normalized Area')

plt.tight_layout()
plt.show()

# Summary statistics
print(f"\n📊 Summary by Species:")
print(df.groupby('species')[['width', 'height', 'area', 'aspect_ratio', 'normalized_area']].mean())

