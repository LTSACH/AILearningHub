"""
Oxford Pets Spatial Distribution - Matplotlib Version

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/spatial_distribution.csv
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
df = pd.read_csv(base_url + 'spatial_distribution.csv')

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.suptitle('Spatial Distribution Analysis', fontsize=14, fontweight='bold')

# 1. Position Heatmap
h = axes[0].hist2d(df['center_x'], df['center_y'], bins=30, cmap='hot')
axes[0].set_xlabel('X Position (normalized)')
axes[0].set_ylabel('Y Position (normalized)')
axes[0].set_title('Bbox Center Position Heatmap')
axes[0].set_xlim(0, 1)
axes[0].set_ylim(0, 1)
axes[0].set_aspect('equal')
plt.colorbar(h[3], ax=axes[0], label='Count')

# 2. Distance from Center
df['dist_center'] = np.sqrt((df['center_x'] - 0.5)**2 + (df['center_y'] - 0.5)**2)
axes[1].hist(df['dist_center'], bins=50, color='#8b5cf6', alpha=0.7)
axes[1].set_xlabel('Distance from Center')
axes[1].set_ylabel('Count')
axes[1].set_title('Center Bias Distribution')
axes[1].axvline(df['dist_center'].mean(), color='red', linestyle='--', 
                label=f"Mean: {df['dist_center'].mean():.3f}")
axes[1].legend()
axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

center_boxes = (df['dist_center'] < 0.3).sum()
print(f"Boxes near center: {center_boxes} ({center_boxes/len(df)*100:.1f}%)")

