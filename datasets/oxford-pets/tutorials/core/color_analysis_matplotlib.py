"""
Core EDA - Color Space Analysis & Quality Metrics (Matplotlib)
Reproduces charts from: https://ltsach.github.io/AILearningHub/01_Data_Analysis/01_EDA/oxford_pets_classification/eda_core.html

Run this in Google Colab:
1. Copy & paste entire code
2. Run cell
3. See exact same charts as web report!
"""

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import pandas as pd
import numpy as np

print("="*70)
print("🎨 CORE EDA - Color Space Analysis & Quality Metrics (Matplotlib)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading color analysis data from GitHub Pages...")

url_stats = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/core/image_statistics.csv'
df = pd.read_csv(url_stats)
print(f"   ✓ Loaded {len(df):,} images")

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
ax1.set_facecolor('#f5f5f5')

# ----------------------------------------------------------------------------
# Chart 2: Image Quality Metrics (Sharpness vs Contrast)
# ----------------------------------------------------------------------------
ax2 = fig.add_subplot(2, 3, 2)

for species in df['species'].unique():
    species_data = df[df['species'] == species]
    ax2.scatter(
        species_data['sharpness'],
        species_data['contrast'],
        c=colors_dict.get(species, '#10b981'),
        s=50,
        alpha=0.6,
        edgecolors='white',
        linewidths=0.5,
        label=species.capitalize()
    )

ax2.set_xlabel('Sharpness (Laplacian Variance)', fontsize=11, fontweight='bold')
ax2.set_ylabel('Contrast (Standard Deviation)', fontsize=11, fontweight='bold')
ax2.set_title('Image Quality Metrics', fontsize=13, fontweight='bold', pad=15)
ax2.grid(True, alpha=0.3, color='#f0f0f0')
ax2.legend(loc='upper right', framealpha=0.9)
ax2.set_facecolor('white')

# ----------------------------------------------------------------------------
# Chart 3: RGB Channel Distribution (Box Plots)
# ----------------------------------------------------------------------------
ax3 = fig.add_subplot(2, 3, 3)

channel_data = [df['mean_r'], df['mean_g'], df['mean_b']]
channel_labels = ['Red', 'Green', 'Blue']
channel_colors = ['#ef4444', '#22c55e', '#3b82f6']

bp = ax3.boxplot(
    channel_data,
    labels=channel_labels,
    patch_artist=True,
    showmeans=True,
    meanline=True,
    widths=0.6
)

for patch, color in zip(bp['boxes'], channel_colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

ax3.set_ylabel('Channel Value (0-255)', fontsize=11, fontweight='bold')
ax3.set_xlabel('Channel', fontsize=11, fontweight='bold')
ax3.set_title('RGB Channel Value Distribution', fontsize=13, fontweight='bold', pad=15)
ax3.set_ylim(0, 255)
ax3.grid(True, alpha=0.3, axis='y')
ax3.set_facecolor('white')

# ----------------------------------------------------------------------------
# Chart 4: Brightness Distribution by Species
# ----------------------------------------------------------------------------
ax4 = fig.add_subplot(2, 3, 4)

for species in df['species'].unique():
    species_data = df[df['species'] == species]
    ax4.hist(
        species_data['brightness'],
        bins=30,
        alpha=0.7,
        color=colors_dict.get(species, '#10b981'),
        label=species.capitalize(),
        edgecolor='white',
        linewidth=0.5
    )

ax4.set_xlabel('Brightness', fontsize=11, fontweight='bold')
ax4.set_ylabel('Count', fontsize=11, fontweight='bold')
ax4.set_title('Brightness Distribution', fontsize=13, fontweight='bold', pad=15)
ax4.grid(True, alpha=0.3, axis='y')
ax4.legend(loc='upper right', framealpha=0.9)
ax4.set_facecolor('white')

# ----------------------------------------------------------------------------
# Chart 5: Contrast Distribution by Species
# ----------------------------------------------------------------------------
ax5 = fig.add_subplot(2, 3, 5)

for species in df['species'].unique():
    species_data = df[df['species'] == species]
    ax5.hist(
        species_data['contrast'],
        bins=30,
        alpha=0.7,
        color=colors_dict.get(species, '#10b981'),
        label=species.capitalize(),
        edgecolor='white',
        linewidth=0.5
    )

ax5.set_xlabel('Contrast (Std Dev)', fontsize=11, fontweight='bold')
ax5.set_ylabel('Count', fontsize=11, fontweight='bold')
ax5.set_title('Contrast Distribution', fontsize=13, fontweight='bold', pad=15)
ax5.grid(True, alpha=0.3, axis='y')
ax5.legend(loc='upper right', framealpha=0.9)
ax5.set_facecolor('white')

# ----------------------------------------------------------------------------
# Chart 6: Statistics Summary (Text Box)
# ----------------------------------------------------------------------------
ax6 = fig.add_subplot(2, 3, 6)
ax6.axis('off')

stats_text = f"""
🎨 COLOR STATISTICS

Red Channel:
   • Mean: {df['mean_r'].mean():.1f} (±{df['mean_r'].std():.1f})
   • Range: {df['mean_r'].min():.1f} - {df['mean_r'].max():.1f}

Green Channel:
   • Mean: {df['mean_g'].mean():.1f} (±{df['mean_g'].std():.1f})
   • Range: {df['mean_g'].min():.1f} - {df['mean_g'].max():.1f}

Blue Channel:
   • Mean: {df['mean_b'].mean():.1f} (±{df['mean_b'].std():.1f})
   • Range: {df['mean_b'].min():.1f} - {df['mean_b'].max():.1f}

💡 QUALITY METRICS

Brightness:
   • Mean: {df['brightness'].mean():.1f} (±{df['brightness'].std():.1f})

Contrast:
   • Mean: {df['contrast'].mean():.1f} (±{df['contrast'].std():.1f})

Sharpness:
   • Mean: {df['sharpness'].mean():.1f} (±{df['sharpness'].std():.1f})
"""

ax6.text(0.1, 0.5, stats_text, fontsize=10, verticalalignment='center',
         family='monospace', bbox=dict(boxstyle='round', facecolor='#f8f9fa', alpha=0.9))

# ============================================================================
# FINAL LAYOUT
# ============================================================================
plt.suptitle('Oxford Pets - Core EDA: Color Space Analysis & Quality Metrics', 
             fontsize=16, fontweight='bold', y=0.995)
plt.tight_layout(rect=[0, 0, 1, 0.99])
fig.patch.set_facecolor('white')

print("   ✓ All charts created")
plt.show()

# ============================================================================
# PRINT STATISTICS
# ============================================================================
print("\n" + "="*70)
print("🎨 COLOR STATISTICS SUMMARY")
print("="*70)

print(f"\nRed Channel:")
print(f"   • Mean: {df['mean_r'].mean():.1f} (std: {df['mean_r'].std():.1f})")
print(f"   • Range: {df['mean_r'].min():.1f} - {df['mean_r'].max():.1f}")

print(f"\nGreen Channel:")
print(f"   • Mean: {df['mean_g'].mean():.1f} (std: {df['mean_g'].std():.1f})")
print(f"   • Range: {df['mean_g'].min():.1f} - {df['mean_g'].max():.1f}")

print(f"\nBlue Channel:")
print(f"   • Mean: {df['mean_b'].mean():.1f} (std: {df['mean_b'].std():.1f})")
print(f"   • Range: {df['mean_b'].min():.1f} - {df['mean_b'].max():.1f}")

print(f"\n💡 Quality Metrics:")
print(f"   • Brightness: {df['brightness'].mean():.1f} (±{df['brightness'].std():.1f})")
print(f"   • Contrast: {df['contrast'].mean():.1f} (±{df['contrast'].std():.1f})")
print(f"   • Sharpness: {df['sharpness'].mean():.1f} (±{df['sharpness'].std():.1f})")

print("\n🐱🐶 By Species:")
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • Mean RGB: ({species_df['mean_r'].mean():.1f}, {species_df['mean_g'].mean():.1f}, {species_df['mean_b'].mean():.1f})")
    print(f"      • Brightness: {species_df['brightness'].mean():.1f}")
    print(f"      • Contrast: {species_df['contrast'].mean():.1f}")

print("="*70)
print("✅ Analysis complete! Charts match web report.")
