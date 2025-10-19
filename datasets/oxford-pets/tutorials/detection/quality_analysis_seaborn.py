"""
Oxford Pets Quality Analysis - Seaborn Version

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/quality_metrics.csv
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("whitegrid")

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
quality_df = pd.read_csv(base_url + 'quality_metrics.csv')
bbox_df = pd.read_csv(base_url + 'bbox_statistics.csv')

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Quality Analysis', fontsize=14, fontweight='bold')

# 1. Size consistency heatmap
top_breeds = quality_df.nlargest(15, 'count')
sns.heatmap(top_breeds[['area_cv', 'aspect_cv']].T, 
            annot=True, fmt='.3f', cmap='YlOrRd', ax=axes[0, 0],
            xticklabels=top_breeds['breed'], yticklabels=['Area CV', 'Aspect CV'])
axes[0, 0].set_title('Consistency Metrics (Top 15 Breeds)')

# 2. Coverage distribution
sns.violinplot(data=bbox_df, x='species', y='normalized_area', ax=axes[0, 1])
axes[0, 1].set_title('Coverage Distribution by Species')
axes[0, 1].set_ylabel('Normalized Area')

# 3. Size category distribution
sns.countplot(data=bbox_df, x='size_category', hue='species', ax=axes[1, 0])
axes[1, 0].set_title('Size Categories by Species')
axes[1, 0].set_xlabel('Size Category')

# 4. Aspect ratio box plot
sns.boxplot(data=bbox_df, x='species', y='aspect_ratio', ax=axes[1, 1])
axes[1, 1].set_title('Aspect Ratio by Species')
axes[1, 1].axhline(1.0, color='red', linestyle='--', alpha=0.5, label='Square')
axes[1, 1].legend()

plt.tight_layout()
plt.show()

print(f"Quality score: {((quality_df['area_cv'] < 0.5).sum() / len(quality_df) * 100):.1f}%")

