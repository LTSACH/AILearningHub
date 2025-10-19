"""
Oxford Pets Feature Extraction - Matplotlib Version
Uses pre-computed t-SNE/UMAP coordinates with distinct colors for all 37 breeds.
"""
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import colorsys

plt.style.use('seaborn-v0_8-whitegrid')

# ============================================================================
# Load Data
# ============================================================================

print("📊 Loading pre-computed features...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'
tsne_df = pd.read_csv(base_url + 'tsne_coordinates.csv')
umap_df = pd.read_csv(base_url + 'umap_coordinates.csv')
print(f"✓ Loaded {len(tsne_df):,} samples, {tsne_df['breed'].nunique()} breeds")

# ============================================================================
# Generate Color Palette (37 distinct colors)
# ============================================================================

def generate_colors(n):
    """Generate n visually distinct colors"""
    colors = []
    for i in range(n):
        hue = i / n
        sat = 0.7 + (i % 3) * 0.1
        val = 0.8 + (i % 2) * 0.1
        rgb = colorsys.hsv_to_rgb(hue, sat, val)
        colors.append(rgb)
    return colors

breed_names = sorted(tsne_df['breed'].unique())
colors = generate_colors(len(breed_names))
breed_to_color = {breed: colors[i] for i, breed in enumerate(breed_names)}

# ============================================================================
# Create Figure
# ============================================================================

fig, axes = plt.subplots(1, 2, figsize=(16, 6))  # Match web report proportions
fig.suptitle('Feature Space Visualization (ResNet50 Features)', 
             fontsize=16, fontweight='bold')

# ============================================================================
# Plot 1: t-SNE with all 37 breeds (distinct colors)
# ============================================================================

print("\n📈 Creating t-SNE plot with 37 distinct colors...")

for breed in breed_names:
    breed_data = tsne_df[tsne_df['breed'] == breed]
    axes[0].scatter(
        breed_data['tsne_x'],
        breed_data['tsne_y'],
        c=[breed_to_color[breed]],
        label=breed,
        s=40,
        alpha=0.7,
        edgecolors='white',
        linewidths=0.5
    )

axes[0].set_title('t-SNE 2D Projection', fontsize=14, fontweight='bold')
axes[0].set_xlabel('t-SNE Dimension 1', fontsize=12)
axes[0].set_ylabel('t-SNE Dimension 2', fontsize=12)
axes[0].grid(alpha=0.3)

# Legend outside plot area
axes[0].legend(
    bbox_to_anchor=(1.05, 1),
    loc='upper left',
    fontsize=8,
    ncol=1,
    frameon=True,
    fancybox=True,
    shadow=True
)

# ============================================================================
# Plot 2: UMAP with all 37 breeds (distinct colors)
# ============================================================================

print("📈 Creating UMAP plot with 37 distinct colors...")

for breed in breed_names:
    breed_data = umap_df[umap_df['breed'] == breed]
    axes[1].scatter(
        breed_data['umap_x'],
        breed_data['umap_y'],
        c=[breed_to_color[breed]],
        label=breed,
        s=40,
        alpha=0.7,
        edgecolors='white',
        linewidths=0.5
    )

axes[1].set_title('UMAP 2D Projection', fontsize=14, fontweight='bold')
axes[1].set_xlabel('UMAP Dimension 1', fontsize=12)
axes[1].set_ylabel('UMAP Dimension 2', fontsize=12)
axes[1].grid(alpha=0.3)

# Legend
axes[1].legend(
    bbox_to_anchor=(1.05, 1),
    loc='upper left',
    fontsize=8,
    ncol=1,
    frameon=True,
    fancybox=True,
    shadow=True
)

plt.tight_layout()
print("\n✓ Displaying feature visualization...")
plt.show()

# ============================================================================
# Alternative: Species-Level Simplified View
# ============================================================================

print("\n📈 Creating species-level view (cats vs dogs)...")

fig2, ax = plt.subplots(figsize=(10, 7))

for species, color in [('cat', '#667eea'), ('dog', '#f093fb')]:
    species_data = tsne_df[tsne_df['species'] == species]
    ax.scatter(
        species_data['tsne_x'],
        species_data['tsne_y'],
        c=color,
        label=species.capitalize(),
        s=50,
        alpha=0.6,
        edgecolors='white',
        linewidths=1
    )

ax.set_title('t-SNE: Species Separation (Cats vs Dogs)', 
             fontsize=14, fontweight='bold')
ax.set_xlabel('t-SNE Dimension 1', fontsize=12)
ax.set_ylabel('t-SNE Dimension 2', fontsize=12)
ax.legend(fontsize=12, frameon=True, shadow=True)
ax.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("\n✅ Visualization complete!")
print("💡 37 breeds with distinct colors show clear clustering patterns")
print("💡 Matches the web report visualization exactly")
