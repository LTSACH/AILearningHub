"""
Core EDA - Color Space Analysis & Quality Metrics (Seaborn)
Reproduces charts from: https://ltsach.github.io/AILearningHub/01_Data_Analysis/01_EDA/oxford_pets_classification/eda_core.html

Run this in Google Colab:
1. Copy & paste entire code
2. Run cell
3. See exact same charts as web report!
"""

import seaborn as sns
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import pandas as pd
import numpy as np

print("="*70)
print("🎨 CORE EDA - Color Space Analysis & Quality Metrics (Seaborn)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading color analysis data from GitHub Pages...")

url_stats = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/core/image_statistics.csv'
df = pd.read_csv(url_stats)
print(f"   ✓ Loaded {len(df):,} images")

# Set seaborn style
sns.set_style("whitegrid")
sns.set_palette("husl")

# Colors matching web report
colors_dict = {'cat': '#f59e0b', 'dog': '#3b82f6'}

# ============================================================================
# 2. CREATE ALL CHARTS
# ============================================================================
print("\n2️⃣ Creating visualizations...")

fig = plt.figure(figsize=(18, 12))

# ----------------------------------------------------------------------------
# Chart 1: 3D Color Space Distribution (RGB Cube)
# ----------------------------------------------------------------------------
ax1 = fig.add_subplot(2, 3, 1, projection='3d')

scatter = ax1.scatter(
    df['mean_r'],
    df['mean_g'],
    df['mean_b'],
    c=df['brightness'],
    cmap='viridis',
    s=30,
    alpha=0.6,
    edgecolors='white',
    linewidths=0.5
)

ax1.set_xlabel('Red Channel', fontsize=11, fontweight='bold')
ax1.set_ylabel('Green Channel', fontsize=11, fontweight='bold')
ax1.set_zlabel('Blue Channel', fontsize=11, fontweight='bold')
ax1.set_title('Color Space Distribution (RGB)', fontsize=13, fontweight='bold', pad=15)
ax1.set_xlim(0, 255)
ax1.set_ylim(0, 255)
ax1.set_zlim(0, 255)
cbar1 = plt.colorbar(scatter, ax=ax1, shrink=0.6, aspect=10)
cbar1.set_label('Brightness', fontsize=10)
ax1.view_init(elev=20, azim=45)

# ----------------------------------------------------------------------------
# Chart 2: Image Quality Metrics (Sharpness vs Contrast)
# ----------------------------------------------------------------------------
ax2 = fig.add_subplot(2, 3, 2)

sns.scatterplot(
    data=df,
    x='sharpness',
    y='contrast',
    hue='species',
    palette=colors_dict,
    s=80,
    alpha=0.6,
    edgecolor='white',
    linewidth=0.5,
    ax=ax2
)

ax2.set_xlabel('Sharpness (Laplacian Variance)', fontsize=11, fontweight='bold')
ax2.set_ylabel('Contrast (Standard Deviation)', fontsize=11, fontweight='bold')
ax2.set_title('Image Quality Metrics', fontsize=13, fontweight='bold', pad=15)
ax2.legend(title='Species', loc='upper right', framealpha=0.9)
ax2.grid(True, alpha=0.3)

# ----------------------------------------------------------------------------
# Chart 3: RGB Channel Distribution (Violin Plots)
# ----------------------------------------------------------------------------
ax3 = fig.add_subplot(2, 3, 3)

# Prepare data for violin plot
rgb_data = pd.DataFrame({
    'Value': pd.concat([df['mean_r'], df['mean_g'], df['mean_b']]),
    'Channel': ['Red']*len(df) + ['Green']*len(df) + ['Blue']*len(df)
})

sns.violinplot(
    data=rgb_data,
    x='Channel',
    y='Value',
    palette=['#ef4444', '#22c55e', '#3b82f6'],
    inner='box',
    ax=ax3
)

ax3.set_ylabel('Channel Value (0-255)', fontsize=11, fontweight='bold')
ax3.set_xlabel('Channel', fontsize=11, fontweight='bold')
ax3.set_title('RGB Channel Value Distribution', fontsize=13, fontweight='bold', pad=15)
ax3.set_ylim(0, 255)
ax3.grid(True, alpha=0.3, axis='y')

# ----------------------------------------------------------------------------
# Chart 4: Brightness Distribution by Species
# ----------------------------------------------------------------------------
ax4 = fig.add_subplot(2, 3, 4)

sns.histplot(
    data=df,
    x='brightness',
    hue='species',
    palette=colors_dict,
    bins=30,
    alpha=0.7,
    edgecolor='white',
    linewidth=0.5,
    ax=ax4
)

ax4.set_xlabel('Brightness', fontsize=11, fontweight='bold')
ax4.set_ylabel('Count', fontsize=11, fontweight='bold')
ax4.set_title('Brightness Distribution', fontsize=13, fontweight='bold', pad=15)
ax4.legend(title='Species', framealpha=0.9)
ax4.grid(True, alpha=0.3, axis='y')

# ----------------------------------------------------------------------------
# Chart 5: Contrast Distribution by Species
# ----------------------------------------------------------------------------
ax5 = fig.add_subplot(2, 3, 5)

sns.histplot(
    data=df,
    x='contrast',
    hue='species',
    palette=colors_dict,
    bins=30,
    alpha=0.7,
    edgecolor='white',
    linewidth=0.5,
    ax=ax5
)

ax5.set_xlabel('Contrast (Std Dev)', fontsize=11, fontweight='bold')
ax5.set_ylabel('Count', fontsize=11, fontweight='bold')
ax5.set_title('Contrast Distribution', fontsize=13, fontweight='bold', pad=15)
ax5.legend(title='Species', framealpha=0.9)
ax5.grid(True, alpha=0.3, axis='y')

# ----------------------------------------------------------------------------
# Chart 6: Correlation Heatmap (Quality Metrics)
# ----------------------------------------------------------------------------
ax6 = fig.add_subplot(2, 3, 6)

# Select quality metrics for correlation
quality_cols = ['brightness', 'contrast', 'sharpness', 'mean_r', 'mean_g', 'mean_b']
corr_matrix = df[quality_cols].corr()

sns.heatmap(
    corr_matrix,
    annot=True,
    fmt='.2f',
    cmap='coolwarm',
    center=0,
    square=True,
    linewidths=1,
    cbar_kws={"shrink": 0.8},
    ax=ax6
)

ax6.set_title('Correlation: Quality Metrics & Color', fontsize=13, fontweight='bold', pad=15)
ax6.set_xticklabels(['Bright', 'Contrast', 'Sharp', 'R', 'G', 'B'], rotation=45)
ax6.set_yticklabels(['Bright', 'Contrast', 'Sharp', 'R', 'G', 'B'], rotation=0)

# ============================================================================
# FINAL LAYOUT
# ============================================================================
plt.suptitle('Oxford Pets - Core EDA: Color Space Analysis & Quality Metrics (Seaborn)', 
             fontsize=16, fontweight='bold', y=0.995)
plt.tight_layout(rect=[0, 0, 1, 0.99])
fig.patch.set_facecolor('white')

print("   ✓ All charts created")
plt.show()

# ============================================================================
# ADDITIONAL ANALYSIS: Pair Plot for Quality Metrics
# ============================================================================
print("\n3️⃣ Creating Quality Metrics Pair Plot...")

# Select subset of columns for pair plot
quality_subset = df[['brightness', 'contrast', 'sharpness', 'species']].copy()

# Create pair plot
pair_fig = sns.pairplot(
    quality_subset,
    hue='species',
    palette=colors_dict,
    diag_kind='kde',
    plot_kws={'alpha': 0.6, 's': 30, 'edgecolor': 'white', 'linewidth': 0.5},
    diag_kws={'alpha': 0.7, 'linewidth': 1.5},
    height=3
)

pair_fig.fig.suptitle('Quality Metrics Pair Plot', fontsize=14, fontweight='bold', y=1.01)
print("   ✓ Pair plot created")
plt.show()

# ============================================================================
# STATISTICS SUMMARY
# ============================================================================
print("\n" + "="*70)
print("🎨 COLOR STATISTICS SUMMARY")
print("="*70)

print(f"\nRGB Channels:")
print(f"   Red   : {df['mean_r'].mean():.1f} (±{df['mean_r'].std():.1f}) | Range: {df['mean_r'].min():.1f}-{df['mean_r'].max():.1f}")
print(f"   Green : {df['mean_g'].mean():.1f} (±{df['mean_g'].std():.1f}) | Range: {df['mean_g'].min():.1f}-{df['mean_g'].max():.1f}")
print(f"   Blue  : {df['mean_b'].mean():.1f} (±{df['mean_b'].std():.1f}) | Range: {df['mean_b'].min():.1f}-{df['mean_b'].max():.1f}")

print(f"\n💡 Quality Metrics:")
print(f"   Brightness: {df['brightness'].mean():.1f} (±{df['brightness'].std():.1f})")
print(f"   Contrast  : {df['contrast'].mean():.1f} (±{df['contrast'].std():.1f})")
print(f"   Sharpness : {df['sharpness'].mean():.1f} (±{df['sharpness'].std():.1f})")

print("\n🐱🐶 Species Comparison:")
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    print(f"   {species.capitalize()} (n={len(species_df):,}):")
    print(f"      • RGB: ({species_df['mean_r'].mean():.1f}, {species_df['mean_g'].mean():.1f}, {species_df['mean_b'].mean():.1f})")
    print(f"      • Brightness: {species_df['brightness'].mean():.1f}")
    print(f"      • Contrast: {species_df['contrast'].mean():.1f}")
    print(f"      • Sharpness: {species_df['sharpness'].mean():.1f}")

print("\n📊 Key Correlations:")
print(f"   Brightness ↔ Mean R: {corr_matrix.loc['brightness', 'mean_r']:.3f}")
print(f"   Brightness ↔ Mean G: {corr_matrix.loc['brightness', 'mean_g']:.3f}")
print(f"   Brightness ↔ Mean B: {corr_matrix.loc['brightness', 'mean_b']:.3f}")
print(f"   Contrast ↔ Sharpness: {corr_matrix.loc['contrast', 'sharpness']:.3f}")

print("="*70)
print("✅ Analysis complete! Charts match web report style.")
