"""
Oxford Pets Feature Extraction - Seaborn Version
Beautiful statistical plots with Seaborn for feature visualization.
"""
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import colorsys

sns.set_theme(style="whitegrid")
sns.set_context("notebook", font_scale=1.1)

# ============================================================================
# Load Data
# ============================================================================

print("📊 Loading pre-computed features...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'
tsne_df = pd.read_csv(base_url + 'tsne_coordinates.csv')
umap_df = pd.read_csv(base_url + 'umap_coordinates.csv')
print(f"✓ Loaded {len(tsne_df):,} samples, {tsne_df['breed'].nunique()} breeds")

# ============================================================================
# Generate Distinct Color Palette
# ============================================================================

def generate_palette(n):
    """Generate n distinct colors using HSV"""
    colors = []
    for i in range(n):
        hue = i / n
        sat = 0.7 + (i % 3) * 0.1
        val = 0.8 + (i % 2) * 0.1
        rgb = colorsys.hsv_to_rgb(hue, sat, val)
        colors.append(rgb)
    return colors

breed_names = sorted([b for b in tsne_df['breed'].unique() if pd.notna(b)])
palette = generate_palette(len(breed_names))

# ============================================================================
# Create Figure
# ============================================================================

fig, axes = plt.subplots(1, 2, figsize=(16, 6))  # Match web report proportions
fig.suptitle('Feature Space Visualization (ResNet50)', 
             fontsize=16, fontweight='bold')

# ============================================================================
# Plot 1: t-SNE with Seaborn (37 breeds)
# ============================================================================

print("\n📈 Creating t-SNE scatter plot...")

sns.scatterplot(
    data=tsne_df,
    x='tsne_x',
    y='tsne_y',
    hue='breed',
    palette=palette,
    alpha=0.7,
    s=40,
    edgecolor='white',
    linewidth=0.5,
    ax=axes[0],
    legend='full'
)

axes[0].set_title('t-SNE 2D Projection (37 Breeds)', 
                  fontsize=14, fontweight='bold')
axes[0].set_xlabel('t-SNE Dimension 1', fontsize=12)
axes[0].set_ylabel('t-SNE Dimension 2', fontsize=12)

# Move legend outside
axes[0].legend(
    bbox_to_anchor=(1.05, 1),
    loc='upper left',
    fontsize=8,
    ncol=1,
    frameon=True
)

# ============================================================================
# Plot 2: UMAP with Seaborn (37 breeds)
# ============================================================================

print("📈 Creating UMAP scatter plot...")

sns.scatterplot(
    data=umap_df,
    x='umap_x',
    y='umap_y',
    hue='breed',
    palette=palette,
    alpha=0.7,
    s=40,
    edgecolor='white',
    linewidth=0.5,
    ax=axes[1],
    legend='full'
)

axes[1].set_title('UMAP 2D Projection (37 Breeds)', 
                  fontsize=14, fontweight='bold')
axes[1].set_xlabel('UMAP Dimension 1', fontsize=12)
axes[1].set_ylabel('UMAP Dimension 2', fontsize=12)

# Move legend outside
axes[1].legend(
    bbox_to_anchor=(1.05, 1),
    loc='upper left',
    fontsize=8,
    ncol=1,
    frameon=True
)

plt.tight_layout()
plt.show()

print("\n✅ Visualization complete!")
print("💡 Seaborn automatically handles 37 distinct colors with proper legend")
print("💡 Clear breed clustering visible in both t-SNE and UMAP")
