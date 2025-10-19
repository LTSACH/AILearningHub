"""
Oxford Pets Feature Extraction - Seaborn Version
Uses pre-computed t-SNE/UMAP coordinates for beautiful statistical plots.
"""
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")

print("📊 Loading pre-computed features...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'
tsne_df = pd.read_csv(base_url + 'tsne_coordinates.csv')
umap_df = pd.read_csv(base_url + 'umap_coordinates.csv')
print(f"✓ Loaded {len(tsne_df):,} samples")

# Create figure
fig, axes = plt.subplots(1, 2, figsize=(16, 7))
fig.suptitle('Feature Space Visualization (ResNet50)', fontsize=16, fontweight='bold')

# t-SNE plot
sns.scatterplot(data=tsne_df, x='tsne_x', y='tsne_y', hue='species',
               palette={'cat': '#667eea', 'dog': '#f093fb'},
               alpha=0.6, s=30, ax=axes[0], legend='full')
axes[0].set_title('t-SNE 2D Projection', fontsize=14, fontweight='bold')
axes[0].set_xlabel('t-SNE Dimension 1')
axes[0].set_ylabel('t-SNE Dimension 2')

# UMAP plot
sns.scatterplot(data=umap_df, x='umap_x', y='umap_y', hue='species',
               palette={'cat': '#667eea', 'dog': '#f093fb'},
               alpha=0.6, s=30, ax=axes[1], legend='full')
axes[1].set_title('UMAP 2D Projection', fontsize=14, fontweight='bold')
axes[1].set_xlabel('UMAP Dimension 1')
axes[1].set_ylabel('UMAP Dimension 2')

plt.tight_layout()
plt.show()

print("\n✅ Visualization complete!")
print("💡 Clear separation between species, some breed overlap")
