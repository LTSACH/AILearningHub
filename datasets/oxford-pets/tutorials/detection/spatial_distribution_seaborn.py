"""
Oxford Pets Spatial Distribution - Seaborn Version

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/spatial_distribution.csv
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("white")

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
df = pd.read_csv(base_url + 'spatial_distribution.csv')

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.suptitle('Spatial Distribution', fontsize=14, fontweight='bold')

# 1. Joint plot for center positions by species
for species, color in [('dog', '#3b82f6'), ('cat', '#f59e0b')]:
    species_df = df[df['species'] == species]
    axes[0].scatter(species_df['center_x'], species_df['center_y'], 
                   alpha=0.3, s=20, color=color, label=species)

axes[0].set_xlabel('X Position (normalized)')
axes[0].set_ylabel('Y Position (normalized)')
axes[0].set_title('Bbox Centers by Species')
axes[0].set_xlim(0, 1)
axes[0].set_ylim(0, 1)
axes[0].set_aspect('equal')
axes[0].legend()
axes[0].grid(alpha=0.3)

# 2. KDE plot for center positions
sns.kdeplot(data=df, x='center_x', y='center_y', fill=True, 
            cmap='YlOrRd', levels=10, ax=axes[1])
axes[1].set_xlabel('X Position (normalized)')
axes[1].set_ylabel('Y Position (normalized)')
axes[1].set_title('Center Position Density (KDE)')
axes[1].set_xlim(0, 1)
axes[1].set_ylim(0, 1)
axes[1].set_aspect('equal')

plt.tight_layout()
plt.show()

print(f"Mean position: ({df['center_x'].mean():.3f}, {df['center_y'].mean():.3f})")

