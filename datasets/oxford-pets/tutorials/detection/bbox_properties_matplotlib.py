"""
Oxford Pets Bounding Box Properties - Matplotlib Version

Tutorial: Bbox Properties Analysis
Library: Matplotlib
Author: AILearningHub
Dataset: Oxford-IIIT Pets

Requirements:
    pip install pandas matplotlib numpy

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load data
print("📏 Loading Bounding Box Properties...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
df = pd.read_csv(base_url + 'bbox_statistics.csv')
print(f"✓ Loaded {len(df):,} bounding boxes")

# Create figure with subplots
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Bounding Box Properties Analysis', fontsize=16, fontweight='bold')

# 1. Width & Height Distribution
axes[0, 0].hist(df['width'], bins=50, alpha=0.7, color='#3b82f6', label='Width')
axes[0, 0].hist(df['height'], bins=50, alpha=0.7, color='#f59e0b', label='Height')
axes[0, 0].set_xlabel('Pixels')
axes[0, 0].set_ylabel('Count')
axes[0, 0].set_title('Width & Height Distribution')
axes[0, 0].legend()
axes[0, 0].grid(alpha=0.3)

# 2. Aspect Ratio Distribution
axes[0, 1].hist(df['aspect_ratio'], bins=50, color='#8b5cf6', alpha=0.7)
axes[0, 1].axvline(0.67, color='red', linestyle='--', alpha=0.5, label='Tall')
axes[0, 1].axvline(1.5, color='red', linestyle='--', alpha=0.5, label='Wide')
axes[0, 1].set_xlabel('Aspect Ratio (W/H)')
axes[0, 1].set_ylabel('Count')
axes[0, 1].set_title('Aspect Ratio Distribution')
axes[0, 1].legend()
axes[0, 1].grid(alpha=0.3)

# 3. Size Categories
size_counts = df['size_category'].value_counts()
colors_cat = {'small': '#ef4444', 'medium': '#f59e0b', 'large': '#10b981'}
axes[1, 0].bar(size_counts.index, size_counts.values, 
               color=[colors_cat.get(c, '#666') for c in size_counts.index])
axes[1, 0].set_xlabel('Size Category')
axes[1, 0].set_ylabel('Count')
axes[1, 0].set_title('COCO-style Size Categories')
for i, (cat, val) in enumerate(size_counts.items()):
    axes[1, 0].text(i, val, str(val), ha='center', va='bottom')
axes[1, 0].grid(axis='y', alpha=0.3)

# 4. Normalized Area Distribution
axes[1, 1].hist(df['normalized_area'], bins=50, color='#10b981', alpha=0.7)
axes[1, 1].set_xlabel('Normalized Area (bbox/image)')
axes[1, 1].set_ylabel('Count')
axes[1, 1].set_title('Image Coverage Distribution')
axes[1, 1].axvline(df['normalized_area'].mean(), color='red', linestyle='--', 
                   label=f"Mean: {df['normalized_area'].mean():.2%}")
axes[1, 1].legend()
axes[1, 1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

# Print summary
print(f"\n📊 Summary:")
print(f"  Mean size: {df['width'].mean():.1f} × {df['height'].mean():.1f} px")
print(f"  Mean aspect ratio: {df['aspect_ratio'].mean():.2f}")
print(f"  Mean coverage: {df['normalized_area'].mean():.2%}")

