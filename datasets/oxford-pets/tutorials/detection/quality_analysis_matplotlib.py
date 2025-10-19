"""
Oxford Pets Quality Analysis - Matplotlib Version

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/quality_metrics.csv
"""

import pandas as pd
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
quality_df = pd.read_csv(base_url + 'quality_metrics.csv')

# Top 15 breeds
top_breeds = quality_df.nlargest(15, 'count')

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.suptitle('Quality Analysis by Breed', fontsize=14, fontweight='bold')

# 1. Size Consistency (CV)
axes[0].barh(top_breeds['breed'], top_breeds['area_cv'], color='#3b82f6')
axes[0].set_xlabel('Area CV (lower = more consistent)')
axes[0].set_title('Size Consistency')
axes[0].invert_yaxis()

# 2. Average Coverage
axes[1].barh(top_breeds['breed'], top_breeds['avg_coverage'], color='#10b981')
axes[1].set_xlabel('Average Coverage Ratio')
axes[1].set_title('Image Coverage')
axes[1].invert_yaxis()

plt.tight_layout()
plt.show()

print(f"Overall quality score: {((quality_df['area_cv'] < 0.5).sum() / len(quality_df) * 100):.1f}%")

