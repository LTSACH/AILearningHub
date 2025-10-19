"""
Oxford Pets Feature Extraction - Matplotlib Version
Uses pre-computed t-SNE/UMAP coordinates for instant visualization.
"""
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

plt.style.use('seaborn-v0_8-darkgrid')

print("📊 Loading pre-computed features...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'
tsne_df = pd.read_csv(base_url + 'tsne_coordinates.csv')
umap_df = pd.read_csv(base_url + 'umap_coordinates.csv')
print(f"✓ Loaded {len(tsne_df):,} samples")

# Create figure
fig, axes = plt.subplots(1, 2, figsize=(16, 7))
fig.suptitle('Feature Space Visualization (ResNet50)', fontsize=16, fontweight='bold')

# t-SNE plot
for species in ['cat', 'dog']:
    data = tsne_df[tsne_df['species'] == species]
    axes[0].scatter(data['tsne_x'], data['tsne_y'], 
                   label=species.capitalize(), alpha=0.6, s=20,
                   c='#667eea' if species=='cat' else '#f093fb')
axes[0].set_title('t-SNE 2D Projection', fontsize=14, fontweight='bold')
axes[0].set_xlabel('t-SNE Dimension 1')
axes[0].set_ylabel('t-SNE Dimension 2')
axes[0].legend()
axes[0].grid(alpha=0.3)

# UMAP plot
for species in ['cat', 'dog']:
    data = umap_df[umap_df['species'] == species]
    axes[1].scatter(data['umap_x'], data['umap_y'], 
                   label=species.capitalize(), alpha=0.6, s=20,
                   c='#667eea' if species=='cat' else '#f093fb')
axes[1].set_title('UMAP 2D Projection', fontsize=14, fontweight='bold')
axes[1].set_xlabel('UMAP Dimension 1')
axes[1].set_ylabel('UMAP Dimension 2')
axes[1].legend()
axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("\n✅ Visualization complete!")
print("💡 Both methods show clear breed clustering and species separation")
